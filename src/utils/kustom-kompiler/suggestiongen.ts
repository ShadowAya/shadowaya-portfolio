import { funcNameMap } from "./codegen";
import { Token } from "./lexer";

export type CursorMeta = {
    line: number,
    column: number,
    screenX: number,
    screenY: number,
    currentTokenIndex: number,
    declaredVariables: Set<string>,
    hide: boolean
};

export type Suggestion = {
    icon?: string | null;
    value?: string;
    realValue?: string;
    toErase?: [number, number];
    description?: string;
    usage?: [string, ('bold' | 'italic')[]][];
}

const keywords = [
    [
        'for',
        'for (',
        'For loop',
        [
            ['for (start; end; step) ', []],
            ['(sep)', ['italic']],
            [' { ... }', []],
        ]
    ],
    [
        'if',
        'if (',
        'If statement',
        [
            ['if (', []],
            ['condition', ['bold']],
            [') { ... }', []],
        ]
    ]
] as [string, string, string, NonNullable<Suggestion['usage']>][];

let anyPatternFor = '(COMMA|AND|OR|EQ|NE|LT|GT|LE|GE|ADD|SUB|MUL|DIV|LVAR|GVAR|FUNC|STRING|NUMBER|LPAREN|RPAREN| )' as const;
let anyPatternFunc = '(AND|OR|EQ|NE|LT|GT|LE|GE|ADD|SUB|MUL|DIV|LVAR|GVAR|STRING|NUMBER|LPAREN|RPAREN| )' as const;

const forLoopShape = [
    ['FOR LPAREN', 'FOR LPAREN'],
    [`${anyPatternFor}+ SEMICOL`, 'NUMBER SEMICOL'],
    [`${anyPatternFor}+ SEMICOL`, 'NUMBER SEMICOL'],
    [`${anyPatternFor}+ RPAREN`, 'NUMBER RPAREN'],
    [`LPAREN ${anyPatternFor}+ RPAREN`, 'LPAREN STRING RPAREN'],
] as const;

const forLoopPattern = forLoopShape.map(t => t[0]).join(' ');

export default function generateSuggestions(tokens: Token[], cursorMeta: CursorMeta ): Suggestion[] {
    const currentToken = tokens[cursorMeta.currentTokenIndex];

    if (!currentToken || currentToken.kind === 'EOF' || cursorMeta.hide)
        return [];
    
    const suggestions: Suggestion[] = [];

    // find for loop
    let forStartIndex = cursorMeta.currentTokenIndex;
    
    while (forStartIndex >= 0) {
        const token = tokens[forStartIndex];
        if (token.kind === 'FOR') break;
        forStartIndex--;
    }

    let forLoopTokens = tokens.slice(forStartIndex, cursorMeta.currentTokenIndex + 1).filter(t => t.kind !== 'WS').map(t => t.kind);
    
    let addedForTokens = 0;
    for (; addedForTokens < forLoopShape.length; addedForTokens++) {
        let formatted = [
            ...forLoopTokens, ...forLoopShape.slice(5 - addedForTokens, 5).map(t => t[1])
        ].join(' ');

        if (formatted.match(forLoopPattern)) break;
    }

    if (addedForTokens !== 0 && addedForTokens !== 5) {
        switch (addedForTokens) {
            case 4:
                // first argument
                suggestions.push({
                    description: 'Start index (number)',
                    icon: 'ph:list-bold',
                    usage: [
                        ['for (', []],
                        ['start', ['bold']],
                        ['; end; step) ', []],
                        ['(sep)', ['italic']],
                        [' { ... }', []],
                    ],
                });
                break;
            case 3:
                // second argument
                suggestions.push({
                    description: 'end index (number)',
                    icon: 'ph:list-bold',
                    usage: [
                        ['for (start; ', []],
                        ['end', ['bold']],
                        ['; step) ', []],
                        ['(sep)', ['italic']],
                        [' { ... }', []],
                    ]
                });
                break;
            case 2:
                // third argument
                suggestions.push({
                    value: 'i + 1',
                    description: 'step (i)',
                    icon: 'ph:list-bold',
                    usage: [
                        ['for (start; end; ', []],
                        ['step', ['bold']],
                        [') ', []],
                        ['(sep)', ['italic']],
                        [' { ... }', []],
                    ]
                });
                break;
            case 1:
                // separator
                suggestions.push({
                    description: 'separator (optional)',
                    icon: 'ph:list-bold',
                    usage: [
                        ['for (start; end; step) ', []],
                        ['(sep)', ['bold', 'italic']],
                        [' { ... }', []],
                    ]
                });
                break;
        }
    }

    // variables
    if (currentToken.value.startsWith('#') || currentToken.value.startsWith('@')) {
        [...cursorMeta.declaredVariables].filter(v => v.startsWith(currentToken.value)).forEach(v => {
            suggestions.push({
                icon: 'majesticons:box',
                value: v,
                realValue: v.substring(currentToken.value.length),
                description: `variable (${v.startsWith('@') ? 'global' : 'local'})`,
            });
        });
    }

    // function args

    let blockKeywords = false;
    let funcToken: Token;
    let callIndex = cursorMeta.currentTokenIndex - 1;
    do {
        funcToken = tokens[callIndex];
        callIndex--;
    } while (funcToken && !([
        'IF',
        'ELSE',
        'FOR',
        'LBRACE',
        'RBRACE',
        'SEMICOL',
        'ASSIGN',
        'FUNC',
    ] as Token['kind'][]).includes(funcToken.kind));

    const functionKey = funcToken && funcToken.kind === 'FUNC' ? Object.keys(funcNameMap).find(f => f === funcToken.value) : undefined;

    if (functionKey) {
        const func = funcNameMap[functionKey as keyof typeof funcNameMap];
        const functionCallTokens = tokens.slice(callIndex, cursorMeta.currentTokenIndex).filter(t => t.kind !== 'WS').map(t => t.kind).slice(2);

        let commaCount = functionCallTokens.filter(t => t === 'COMMA').length;
        if (currentToken.kind === 'COMMA') commaCount++;
        if (
            functionCallTokens.filter(t => t === 'LPAREN').length ===
            functionCallTokens.filter(t => t === 'RPAREN').length &&
            currentToken.kind === 'RPAREN'
        ) commaCount = -1;
        if (currentToken.kind === 'SEMICOL') commaCount = -1;

        if (commaCount != -1) {
            const args = func.slice(1);
            const argsString: Suggestion['usage'] = [];
            let argOptions: Suggestion[] = [];

            let commaNext = false;
            args.map((v, i) => {
                const isActive = i === commaCount;
                const isLast = args.length === i+1;
                argsString.push([
                    `${commaNext ? ', ':''}${v[0]}${isLast || isActive ? '':', '}`,
                    (isActive ? ['bold'] : [])
                ]);
                commaNext = isActive;
                if (isActive) {

                    let eraseAnchor = callIndex + 2;

                    for (let ei = 0; ei < i; ei++) {
                        while (tokens[eraseAnchor].kind !== 'COMMA') eraseAnchor++;
                    }
                    while (tokens[eraseAnchor + 1].kind === 'WS') eraseAnchor++;

                    const toErase: [number, number] = [0, 0];
                        
                    if (eraseAnchor < cursorMeta.currentTokenIndex) {
                        const thisTokenEnd = currentToken.column;
                        const thisTokenStart = thisTokenEnd - currentToken.value.length;
                        toErase[0] = cursorMeta.column - thisTokenStart;
                        toErase[1] = thisTokenEnd - cursorMeta.column;
                    }

                    (v.slice(1) as [string, string][]).forEach(([val, desc]) => {

                        if (
                            ['COMMA', 'LPAREN', 'WS'].includes(currentToken.kind) ||
                            `${val}`.includes(currentToken.value.replaceAll('"', ''))
                        ) 
                            argOptions.push({
                                icon: null,
                                value: val,
                                description: desc,
                                realValue: `"${val}"${isLast ? ')':', '}`,
                                toErase,
                            });
                    });
                }
            });

            blockKeywords = true;

            suggestions.push({
                icon: 'ph:code',
                description: `function (${func[0]})`,
                usage: [
                    [`${functionKey}(`, []],
                    ...argsString,
                    [')', []]
                ]
            } satisfies Suggestion);

            suggestions.push(...argOptions);

        }
    }

        // any functional token
        if (currentToken.kind == 'FUNC') {
            const val = currentToken.value;
    
            // keywords
    
            if (!blockKeywords) {
                const keywordMatches = keywords.filter(([keyword]) => keyword.startsWith(val));
    
                suggestions.push(...keywordMatches.map(([keyword, value, description, usage]) => ({
                    icon: 'ph:list-bold',
                    value: keyword,
                    description,
                    usage,
                    realValue: value.substring(val.length + (tokens[cursorMeta.currentTokenIndex + 1]?.kind === 'LPAREN' ? 1 : 0)),
                } satisfies Suggestion)));
            }
    
            // functions
    
            Object.keys(funcNameMap).filter(f => f.startsWith(val)).forEach(f => {
                const func = funcNameMap[f as keyof typeof funcNameMap];
    
                const nextToken = tokens[cursorMeta.currentTokenIndex + 1];
    
                suggestions.push({
                    icon: 'ph:code',
                    value: f,
                    description: `function (${func[0]})`,
                    realValue: f.substring(val.length) + (nextToken?.kind === 'LPAREN' ? '': '('),
                    usage: [[
                        `${f}(${func.slice(1).map(v => {
                            let val = v[0];
                            if (!val) return val;

                            let braceIndex = val.search(' \\(');
                            if (braceIndex != -1) {
                                val = val.substring(0, braceIndex);
                            }
                            return val;
                        }).join(', ')})`,
                    []]]
                });
            });
    
        }

    return suggestions;
}