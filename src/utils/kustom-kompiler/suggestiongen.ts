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
    link?: string;
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
            ['if (condition) { ... }', []],
        ]
    ]
] as [string, string, string, NonNullable<Suggestion['usage']>][];

let anyPatternFor = '(COMMA|AND|OR|EQ|NE|LT|GT|LE|GE|ADD|SUB|MUL|DIV|LVAR|GVAR|FUNC|STRING|NUMBER|LPAREN|RPAREN| )' as const;
let anyPatternIf = '(AND|OR|EQ|NE|LT|GT|LE|GE|ADD|SUB|MUL|DIV|LVAR|GVAR|FUNC|STRING|NUMBER|LPAREN|RPAREN| )' as const;

const keywordShapes = {
    'FOR' : [
        ['FOR LPAREN', 'FOR LPAREN'],
        [`${anyPatternFor}+ SEMICOL`, 'NUMBER SEMICOL'],
        [`${anyPatternFor}+ SEMICOL`, 'NUMBER SEMICOL'],
        [`${anyPatternFor}+ RPAREN`, 'NUMBER RPAREN'],
        [`LPAREN ${anyPatternFor}+ RPAREN`, 'LPAREN STRING RPAREN'],
    ],
    'IF' : [
        ['IF LPAREN', 'IF LPAREN'],
        [`${anyPatternIf}+`, 'NUMBER'],
    ]
} as const;

type KeywordPatterns = {
    -readonly [key in keyof typeof keywordShapes]: string
};

const foundKeywordKinds = Object.keys(keywordShapes) as (keyof KeywordPatterns)[];

const keywordPatterns: KeywordPatterns = {} as KeywordPatterns;
for (const keywordShape of Object.entries(keywordShapes)) {
    keywordPatterns[keywordShape[0] as keyof KeywordPatterns] = keywordShape[1].map(t => t[0]).join(' ');
}

const keywordSuggestions: {
    -readonly [key in keyof typeof keywordShapes]: {
        [key: `${number}`]: Suggestion
    }
} = {
    'FOR': {
        4: {
            description: 'Start index (number)',
            icon: 'ph:list-bold',
            usage: [
                ['for (', []],
                ['start', ['bold']],
                ['; end; step) ', []],
                ['(sep)', ['italic']],
                [' { ... }', []],
            ],
        },
        3: {
            description: 'end index (number)',
            icon: 'ph:list-bold',
            usage: [
                ['for (start; ', []],
                ['end', ['bold']],
                ['; step) ', []],
                ['(sep)', ['italic']],
                [' { ... }', []],
            ]
        },
        2: {
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
        },
        1: {
            description: 'separator (optional)',
            icon: 'ph:list-bold',
            usage: [
                ['for (start; end; step) ', []],
                ['(sep)', ['bold', 'italic']],
                [' { ... }', []],
            ]
        },
    },
    'IF': {
        1: {
            description: "Condition",
            icon: 'ph:list-bold',
            usage: [
                ['if (', []],
                ['condition', ['bold']],
                [') { ... }', []],
            ],
        },
    }
};

export default function generateSuggestions(tokens: Token[], cursorMeta: CursorMeta ): Suggestion[] {
    const currentToken = tokens[cursorMeta.currentTokenIndex];

    if (!currentToken || currentToken.kind === 'EOF' || cursorMeta.hide)
        return [];
    
    const suggestions: Suggestion[] = [];

    
    /**
     * 
     * for loop
     * 
     */
    let tokenStartIndex = cursorMeta.currentTokenIndex;
    
    let foundKeywordKind: keyof KeywordPatterns | undefined;
    while (tokenStartIndex >= 0) {
        const kind = tokens[tokenStartIndex].kind;
        if (foundKeywordKinds.includes(kind as any)) {
            foundKeywordKind = kind as any;
            break;
        }
        tokenStartIndex--;
    }

    if (foundKeywordKind) {
        
        let foundKeywordTokens = tokens.slice(tokenStartIndex, cursorMeta.currentTokenIndex + 1).filter(t => t.kind !== 'WS').map(t => t.kind);
        let foundKeywordShape = keywordShapes[foundKeywordKind];
        let foundKeywordPattern = keywordPatterns[foundKeywordKind];

        let addedForTokens = 0;
        for (; addedForTokens < foundKeywordShape.length; addedForTokens++) {
            let formatted = [
                ...foundKeywordTokens, ...foundKeywordShape.slice(foundKeywordShape.length - addedForTokens, foundKeywordShape.length).map(t => t[1])
            ].join(' ');

            if (formatted.match(foundKeywordPattern)) break;
        }

        if (addedForTokens !== 0 && addedForTokens !== foundKeywordShape.length) {
            suggestions.push(keywordSuggestions[foundKeywordKind][`${addedForTokens}`])
        }
    }

    /**
     * 
     * variables
     * 
     */
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

    /**
     * 
     * function args
     * 
     */

    let blockKeywords = false;
    let funcToken: Token;
    let callIndex = cursorMeta.currentTokenIndex;

    let countedParensForFn = 0;
    do {
        funcToken = tokens[callIndex];

        if (!funcToken) continue;

        if (funcToken.kind === 'RPAREN') countedParensForFn--;
        else if (funcToken.kind === 'LPAREN') countedParensForFn++;

        if (countedParensForFn === 1 && funcToken.kind === 'FUNC') break;

        callIndex--;
    } while (funcToken && !([
        'IF',
        'ELSE',
        'FOR',
        'LBRACE',
        'RBRACE',
        'SEMICOL',
        'ASSIGN',
    ] as Token['kind'][]).includes(funcToken.kind));

    const functionKey = funcToken && funcToken.kind === 'FUNC' ? Object.keys(funcNameMap).find(f => f === funcToken.value) : undefined;

    if (functionKey) {
        let parenCounter = 0;
        const func = funcNameMap[functionKey as keyof typeof funcNameMap];
        const functionCallTokens = tokens.slice(callIndex, cursorMeta.currentTokenIndex).map(t => t.kind).slice(2);

        let isRestArg = false;

        let commaTokensIndexes: number[] = [0];
        let commaCount = functionCallTokens.filter((t, i) => {
            if (t === 'RPAREN') parenCounter++;
            else if (t === 'LPAREN') parenCounter--;
            const ret = t === 'COMMA' && parenCounter === 0;
            if (ret) commaTokensIndexes.push(i);
            return ret;
        }).length;
        if (currentToken.kind === 'COMMA') commaCount++;
        if (
            functionCallTokens.filter(t => t === 'LPAREN').length ===
            functionCallTokens.filter(t => t === 'RPAREN').length &&
            currentToken.kind === 'RPAREN'
        ) commaCount = -1;
        if (currentToken.kind === 'SEMICOL') commaCount = -1;
        if (func[func.length - 1][0]?.startsWith("...") && commaCount >= func.length - 2) {
            isRestArg = true;
        }
        commaTokensIndexes.push(-1);

        if (commaCount != -1) {
            const args = func.slice(1);
            const argsListOnly = args.map(v => v.slice(1));
            const argsString: Suggestion['usage'] = [];
            let argOptions: Suggestion[] = [];

            let commaNext = false;
            args.map((v, i) => {
                const isActive =
                    (i === commaCount) ||
                    (isRestArg && i === args.length - 1);
                const isLast = args.length === i+1;
                argsString.push([
                    `${commaNext ? ', ':''}${v[0]}${isLast || isActive ? '':', '}`,
                    (isActive ? ['bold'] : [])
                ]);
                commaNext = isActive;
                if (isActive) {

                    let eraseAnchor = callIndex + 2;
                    
                    let argumentsPassed = 0;
                    parenCounter = 0;

                    for (let ei = 0; ei < i; ei++) {
                        while (true) {
                            if (tokens[eraseAnchor].kind == 'LPAREN') parenCounter++;
                            else if (tokens[eraseAnchor].kind == 'RPAREN') parenCounter--;
                            else if (tokens[eraseAnchor].kind === 'COMMA') {
                                if (parenCounter !== 0) {
                                    continue;
                                } else if (argumentsPassed === commaCount - 1) {
                                    break;
                                } else {
                                    argumentsPassed++;
                                }
                            }
                            else if (tokens[eraseAnchor].kind === 'EOF') break;
                            eraseAnchor++;
                        };
                    }
                    while (tokens[eraseAnchor + 1] && tokens[eraseAnchor + 1].kind === 'WS') eraseAnchor++;
                    if (tokens[eraseAnchor] && tokens[eraseAnchor].kind === 'WS') eraseAnchor++;

                    const toErase: [number, number] = [0, 0];

                    let onlyOmitList: (number | [number, number[]])[] = [];
                    let firstArgValue = tokens[callIndex + 2].value;

                    // regex check
                    for (const regexEntry of (argsListOnly[0] as string[]).filter(v => v[0].startsWith('REGEX'))) {
                        const regex = regexEntry[0].substring(5);
                        console.log(regex, firstArgValue);
                        if (firstArgValue.match(regex)) onlyOmitList = regexEntry[1] as any;
                    }

                    // literal arguments check
                    let foundArg = (argsListOnly[0] as string[]).find(v => v[0] === firstArgValue);
                    if (foundArg) {
                        onlyOmitList = (foundArg[2] as any)??[];
                    }

                    if (eraseAnchor <= cursorMeta.currentTokenIndex) {
                        const thisTokenEnd = currentToken.column;
                        const thisTokenStart = thisTokenEnd - currentToken.value.length;
                        toErase[0] = cursorMeta.column - thisTokenStart;
                        toErase[1] = thisTokenEnd - cursorMeta.column;
                    }

                    let isOptional = v[0] && v[0].startsWith('*');

                    let hasBrace = false;
                    if (commaTokensIndexes[i] != -1) {
                        hasBrace = tokens.slice(
                            (callIndex + 2) + commaTokensIndexes[i] + 1,
                            cursorMeta.currentTokenIndex
                        ).find(v => ['LPAREN', 'RPAREN'].includes(v.kind)) != undefined;
                    }

                    if (onlyOmitList.includes(i)) {
                        argOptions.unshift({
                            icon: null,
                            value: 'omit',
                            description: `This option is omitted for ${firstArgValue.length < 11 ? firstArgValue : (firstArgValue.substring(0, 10) + "...")}`,
                            realValue: `omit${isLast ? ')':', '}`,
                            toErase,
                        });
                    } else {

                        onlyOmitList = ((onlyOmitList.find(v => typeof v !== 'number' && v[0] === i)) as [number, number[]])?.[1] ?? [];

                        (v.slice(1) as [string, string][]).forEach(([val, desc], vi) => {

                            if (
                                (
                                    !val.startsWith('REGEX')
                                ) && (
                                    !onlyOmitList.includes(vi)
                                ) && (
                                    !val.match(/^.+\(.*$/g) || !hasBrace
                                    // dont suggest anything containing functions if a function is already entered
                                ) && (
                                    ['COMMA', 'LPAREN', 'WS'].includes(currentToken.kind) ||
                                    `${val}`.includes(currentToken.value.replaceAll('"', ''))
                                )
                                
                            ) {
                                // const terminator = isLast && !isRestArg ? ')':', ';
                                argOptions.push({
                                    icon: null,
                                    value: val,
                                    description: desc,
                                    realValue: `${val}`,
                                    toErase,
                                });
                            }
                        });

                        if (
                            isOptional &&
                            (
                                ['COMMA', 'LPAREN', 'WS'].includes(currentToken.kind) ||
                                'omit'.startsWith(currentToken.value)
                            )
                        ) {
                            let toErase: [number, number] = [(
                                currentToken.kind === 'FUNC' || currentToken.kind === 'OMIT' ?
                                    currentToken.value.length : 0
                            ), 0]
                            argOptions.unshift({
                                icon: null,
                                value: 'omit',
                                realValue: `omit${isLast ? ')':', '}`,
                                description: 'Argument is optional',
                                toErase,
                            });
                        }
                    }
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
                ],
                link: `https://docs.kustom.rocks/docs/reference/functions/${func[0]}`,
            } satisfies Suggestion);

            suggestions.push(...argOptions);

        }
    }

        // any functional token
        if (currentToken.kind == 'FUNC') {
            const val = currentToken.value;
    
            /**
             * 
             * keywords
             * 
             */

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
    
            /**
             * 
             * functions
             * 
             */
    
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
                            return v[0];
                            // let val = v[0];
                            // if (!val) return val;

                            // let braceIndex = val.search(' \\(');
                            // if (braceIndex != -1) {
                            //     val = val.substring(0, braceIndex);
                            // }
                            // return val;
                        }).join(', ')})`,
                    []]],
                    link: `https://docs.kustom.rocks/docs/reference/functions/${func[0]}`,
                });
            });
    
        }

    return suggestions;
}