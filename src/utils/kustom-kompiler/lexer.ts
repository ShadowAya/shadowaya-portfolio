export class LexerError extends Error {
    constructor(public line?: number, public column?: number) {
        super(
            line && column
                ? `Line ${line}:${column}: Unexpected token`
                : "Internal error: Could not determine token kind"
        );
    }
}

export function countOccurrences(str: string, subStr: string) {
    return str.split(subStr).length - 1;
}

const tokenSpecification = [
    ["IF", "if"], // 'if' keyword
    ["ELSE", "else"], // 'else' keyword
    ["FOR", "for"], // 'for' keyword
    ["OMIT", "omit"], // 'omit' keyword

    ["COMMA", ","], // ',' operator

    ["AND", "&&"], // '&&' operator
    ["OR", "\\|\\|"], // '||' operator
    ["EQ", "=="], // '==' operator
    ["NE", "!="], // '!=' operator

    ["LT", "<"], // '<' operator
    ["GT", ">"], // '>' operator
    ["LE", "<="], // '<=' operator
    ["GE", ">="], // '>=' operator

    ["ADD", "\\+"], // Addition operator
    ["SUB", "-"], // Subtraction operator
    ["MUL", "\\*"], // Multiplication operator
    ["DIV", "/"], // Division operator

    ["LVAR", "#[a-zA-Z_][a-zA-Z0-9_]*"], // Local Variables
    ["GVAR", "@[a-zA-Z_][a-zA-Z0-9_]*"], // Global Variables
    ["FUNC", "[a-zA-Z_]+"], // Functions
    ["STRING", '"[^"]*"'], // String literals
    ["NUMBER", "\\d+(\\.\\d*)?"], // Integer or decimal number

    ["LPAREN", "\\("], // Left parenthesis
    ["RPAREN", "\\)"], // Right parenthesis
    ["LBRACE", "\\{"], // Left brace
    ["RBRACE", "\\}"], // Right brace
    ["SEMICOL", ";"], // Semicolon

    ["ASSIGN", "="], // Equals (assign) sign

    ["WS", " +"], // Whitespaces
    ["WS", "\\n+"],
    ["WS", "\\t+"],
    ["WS", "\\r+"],

    ["MISMATCH", "."], // Any other character
] as const;
type TokenKinds = (typeof tokenSpecification)[number][0] | "EOF";

export default function lexer(code: string) {
    const tokens: {
        tokens: {
            kind: TokenKinds;
            value: string;
            line: number;
            column: number;
        }[];
        error?: {
            line: number;
            column: number;
        };
    } = {
        tokens: [],
    };

    let line = 1;
    let column = 1;

    const tokenRegex = new RegExp(
        tokenSpecification
            .map(([kind, pattern]) => `(?<${kind}>${pattern})`)
            .join("|"),
        "g"
    );

    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(code)) !== null) {
        let kind: TokenKinds | null = null;
        for (const [groupName, groupValue] of Object.entries(
            match.groups || {}
        )) {
            if (groupValue === match[0]) {
                kind = groupName as TokenKinds;
                break;
            }
        }

        const value = match[0];
        const tokenStartIndex = match.index;

        // Check for newlines between the previous token and this one
        const newlines = countOccurrences(value, "\n");
        line += newlines;

        if (newlines > 0) {
            column = value.length - value.lastIndexOf("\n");
        } else {
            column += value.length;
        }

        if (!kind) {
            tokens.error = { line: -1, column: -1 };
            return tokens;
        } else if (kind === "MISMATCH") {
            // const errorColumn = tokenStartIndex - code.lastIndexOf('\n', tokenStartIndex - 1); // tohle nefunguje
            tokens.error = { line, column };
            return tokens;
        }

        tokens.tokens.push({ kind, value, line, column });
    }

    tokens.tokens.push({ kind: "EOF", value: "", line, column });
    return tokens;
}

export type Token = ReturnType<typeof lexer>["tokens"][0];
