import { type Token } from "./lexer";

class ASTNode {
    node_type: string;
    value: string | number | ASTNode | null;
    children: ASTNode[];
    block_active: boolean;

    line: number;
    column: number;

    constructor(
        node_type: string,
        value: any = null,
        children: ASTNode[] | null = null,
        block_active: boolean = false,
        line: number = 0,
        column: number = 0
    ) {
        this.node_type = node_type;
        this.value = value;
        this.children = children || [];
        this.block_active = block_active;
        this.line = line;
        this.column = column;
    }
}

export type { ASTNode };

export default class Parser {
    tokens: Token[];
    current_token: Token | null;
    pos: number;

    errors: string[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.current_token = null;
        this.pos = -1;
        this.errors = [];

        this.advance();
    }

    advance(): void {
        this.pos += 1;
        if (this.pos < this.tokens.length) {
            this.current_token = this.tokens[this.pos];
        } else {
            this.current_token = null;
        }
        if (this.current_token?.kind === "WS") {
            this.advance();
        }
    }

    deadvance(): void {
        this.pos -= 1;
        if (this.pos >= 0) {
            this.current_token = this.tokens[this.pos];
        } else {
            this.current_token = null;
        }
        if (this.current_token?.kind === "WS") {
            this.deadvance();
        }
    }

    advanceToEnd(): void {
        this.tokens = [
            { kind: "EOF", value: "", line: 0, column: 0 },
            { kind: "EOF", value: "", line: 0, column: 0 },
        ];
        this.current_token = this.tokens[0];
        this.pos = 0;
    }

    returnNextRealToken(): Token {
        let realIndex = this.pos + 1;
        while (this.tokens[realIndex]?.kind === "WS") realIndex++;
        if (this.tokens[realIndex] === undefined) {
            this.advanceToEnd();
            return this.tokens[0];
        }
        return this.tokens[realIndex];
    }

    parse() {
        return {
            nodes: this.parse_statements(),
            errors: this.errors,
        };
    }

    checkTokenType<K extends Token["kind"]>(
        kind: K,
        token: Token = this.current_token!
    ): token is Omit<Token, "kind"> & { kind: K } {
        return !!token && token.kind === kind;
    }

    advanceAndCheck(
        kind: Token["kind"],
        token: Token = this.current_token!,
        dontAdvance: boolean = false
    ) {
        if (token.kind !== kind) {
            if (token.kind === "EOF")
                this.errors.push(
                    `Line ${token.line}:${token.column}: Unexpected end of file`
                );
            else
                this.errors.push(
                    `Line ${token!.line}:${
                        token!.column
                    }: Expected '${kind}' after expression, got: ${token.value}`
                );
        }
        if (!dontAdvance) {
            if (!this.current_token || this.current_token.kind === "EOF")
                this.advanceToEnd();
            else this.advance();
        }
    }

    parse_statement(block_is_active: boolean = false): ASTNode {
        let statement: ASTNode;
        if (this.checkTokenType("IF")) {
            statement = this.parse_if_statement(block_is_active);
        } else if (this.checkTokenType("FOR")) {
            statement = this.parse_for_loop(block_is_active);
        } else if (this.checkTokenType("LVAR") || this.checkTokenType("GVAR")) {
            statement = this.parse_var_declaration(block_is_active);
        } else if (this.checkTokenType("EOF")) {
            statement = new ASTNode("null", null, null, false, 0, 0);
        } else {
            statement = this.parse_expression(block_is_active);
        }

        if (this.checkTokenType("SEMICOL")) {
            this.advance();
        } else if (this.pos > 0 && this.tokens[this.pos - 1]) {
            let i = this.pos - 1;
            while (this.tokens[i].kind === "WS") i--;

            if (
                this.tokens[i].kind !== "RBRACE" &&
                this.tokens[i].kind !== "SEMICOL"
            )
                this.errors.push(
                    `Line ${this.current_token?.line ?? -1}:${
                        this.current_token?.column ?? -1
                    }: Expected ';' after statement, got: '${
                        this.current_token?.value
                    }'`
                );
        }

        return statement;
    }

    parse_statements(block_is_active: boolean = false): ASTNode[] {
        const statements: ASTNode[] = [];
        let limit = 0;
        while (this.current_token && this.current_token.kind !== "RBRACE") {
            if (limit++ > 1000) {
                this.errors = [
                    `Line ${this.current_token.line}:${this.current_token.column}: Parser crashed inside a statement`,
                    "",
                ];
                this.advanceToEnd();
                break;
            }

            if (this.checkTokenType("EOF")) break;
            statements.push(this.parse_statement(block_is_active));
        }
        return statements;
    }

    parse_for_loop(block_is_active: boolean = false): ASTNode {
        this.advance();
        this.advanceAndCheck("LPAREN"); // consume '('

        const start = this.parse_expression(true);
        this.advanceAndCheck("SEMICOL"); // consume ';'

        const end = this.parse_expression(true);
        this.advanceAndCheck("SEMICOL"); // consume ';'

        const step = this.parse_expression(true);
        this.advanceAndCheck("RPAREN"); // consume ')'

        let separator: ASTNode = new ASTNode(
            "null",
            null,
            [],
            false,
            this.current_token!.line,
            this.current_token!.column
        );
        if (this.checkTokenType("LPAREN")) {
            this.advance(); // consume '('
            separator = this.parse_expression(true);
            this.advanceAndCheck("RPAREN"); // consume ')'
        }

        this.advanceAndCheck("LBRACE");

        const body = this.parse_statements(true);
        this.advanceAndCheck("RBRACE"); // consume '}'

        if (body.length === 0) {
            this.errors.push(
                `Line ${this.current_token!.line}:${
                    this.current_token!.column
                }: For loop body cannot be empty`
            );
        }

        return new ASTNode(
            "for_loop",
            null,
            [start, end, step, separator, ...body],
            block_is_active,
            this.current_token!.line,
            this.current_token!.column
        );
    }

    parse_if_statement(block_is_active: boolean = false): ASTNode {
        this.advance(); // consume 'if'
        this.advanceAndCheck("LPAREN"); // consume '('

        const condition = this.parse_expression(true);

        this.advanceAndCheck("RPAREN"); // consume ')'

        let if_body: ASTNode[] | null = null;
        if (this.checkTokenType("LBRACE")) {
            this.advanceAndCheck("LBRACE"); // consume '{'
            if_body = this.parse_statements(true);
            this.advanceAndCheck("RBRACE"); // consume '}'
        } else {
            if_body = [this.parse_statement(true)];
            // this.advance(); // consume ';'
        }

        let else_body: ASTNode[] | null = null;

        if (this.checkTokenType("ELSE")) {
            this.advance(); // consume 'else'
            if (this.checkTokenType("LBRACE")) {
                this.advanceAndCheck("LBRACE"); // consume '{'
                else_body = this.parse_statements(true);
                this.advanceAndCheck("RBRACE"); // consume '}'
            } else {
                else_body = [this.parse_statement(true)];
            }
        }

        return new ASTNode(
            "if_statement",
            condition,
            [if_body, else_body].filter(Boolean) as unknown as ASTNode[],
            block_is_active,
            this.current_token!.line,
            this.current_token!.column
        );
    }

    parse_var_declaration(block_is_active: boolean = false): ASTNode {
        const var_name = this.current_token!.value;
        this.advance(); // consume the variable name

        if (this.checkTokenType("ASSIGN")) {
            if (var_name.startsWith("@"))
                this.errors.push(
                    `Line ${this.current_token!.line}:${
                        this.current_token!.column
                    }: Global variable '${var_name.substring(
                        1
                    )}' cannot be assigned a value`
                );

            this.advance(); // consume '='
            const expr = this.parse_expression(true);
            const var_real_name = var_name.substring(1);
            if (var_real_name.length === 0) {
                this.errors.push(
                    `Line ${this.current_token!.line}:${
                        this.current_token!.column
                    }: Variable name cannot be empty`
                );
            }
            return new ASTNode(
                "var_declaration",
                var_real_name,
                [expr],
                block_is_active,
                this.current_token!.line,
                this.current_token!.column
            );
        } else {
            this.deadvance();
            return this.parse_expression(block_is_active, true);
            //this.errors.push(`Line ${this.current_token!.line}:${this.current_token!.column}: Expected '=' after variable name, got: ${this.current_token}`);
            //return new ASTNode('null', null, [], false, this.current_token!.line, this.current_token!.column);
        }
    }

    parse_expression(
        block_is_active: boolean = false,
        nested_active = false,
        allow_omit = false
    ): ASTNode {
        if (this.current_token!.kind === "OMIT") {
            this.advance();
            if (allow_omit)
                return new ASTNode(
                    "omit",
                    null,
                    null,
                    false,
                    this.current_token!.line,
                    this.current_token!.column
                );
            else {
                this.errors.push(
                    `Line ${this.current_token!.line}:${
                        this.current_token!.column
                    }: 'omit' keyword only allowed as function argument`
                );
                return new ASTNode(
                    "null",
                    null,
                    null,
                    false,
                    this.current_token!.line,
                    this.current_token!.column
                );
            }
        }

        let left = this.parse_term(
            [
                "EQ",
                "NE",
                "AND",
                "OR",
                "ADD",
                "SUB",
                "MUL",
                "DIV",
                "LT",
                "GT",
                "LE",
                "GE",
            ].includes(this.returnNextRealToken().kind)
                ? nested_active || block_is_active
                : block_is_active
        );

        while (
            this.current_token &&
            [
                "EQ",
                "NE",
                "AND",
                "OR",
                "ADD",
                "SUB",
                "MUL",
                "DIV",
                "LT",
                "GT",
                "LE",
                "GE",
            ].includes(this.current_token.kind)
        ) {
            const op_type = this.current_token.kind;
            this.advance(); // consume operator
            const right = this.parse_term(nested_active || block_is_active);
            left = new ASTNode(
                "binary_expression",
                op_type,
                [left, right],
                block_is_active,
                this.current_token.line,
                this.current_token.column
            );
        }

        return left;
    }

    parse_term(block_is_active: boolean = false): ASTNode {
        const token_type = this.current_token!.kind;
        const token_value = this.current_token!.value;
        switch (token_type) {
            case "FUNC":
                const next_token =
                    this.pos + 1 < this.tokens.length
                        ? this.returnNextRealToken()
                        : null;
                if (next_token && next_token.kind === "LPAREN") {
                    return this.parse_function_call(block_is_active);
                } else {
                    this.advance(); // consume variable
                    return new ASTNode(
                        "function",
                        token_value,
                        [],
                        block_is_active,
                        this.current_token!.line,
                        this.current_token!.column
                    );
                }
            case "LVAR":
                this.advance(); // consume variable
                if (token_value.substring(1).length === 0)
                    this.errors.push(
                        `Line ${this.current_token!.line}:${
                            this.current_token!.column
                        }: Variable name cannot be empty`
                    );
                return new ASTNode(
                    "local_variable",
                    token_value.substring(1),
                    [],
                    block_is_active,
                    this.current_token!.line,
                    this.current_token!.column
                );
            case "GVAR":
                this.advance(); // consume variable
                if (token_value.substring(1).length === 0)
                    this.errors.push(
                        `Line ${this.current_token!.line}:${
                            this.current_token!.column
                        }: Variable name cannot be empty`
                    );
                return new ASTNode(
                    "global_variable",
                    token_value.substring(1),
                    [],
                    block_is_active,
                    this.current_token!.line,
                    this.current_token!.column
                );
            case "NUMBER":
                this.advance(); // consume number
                return new ASTNode(
                    "number",
                    token_value,
                    [],
                    false,
                    this.current_token!.line,
                    this.current_token!.column
                );
            case "STRING":
                this.advance(); // consume string
                return new ASTNode(
                    "string",
                    token_value,
                    [],
                    block_is_active,
                    this.current_token!.line,
                    this.current_token!.column
                );
            case "LPAREN":
                this.advance(); // consume '('
                const expr = this.parse_expression(block_is_active);
                this.advance(); // consume ')'
                return new ASTNode(
                    "parenthesized_expression",
                    null,
                    [expr],
                    block_is_active,
                    this.current_token!.line,
                    this.current_token!.column
                );
            default:
                this.errors.push(
                    `Line ${this.current_token!.line}:${
                        this.current_token!.column
                    }: Unexpected token: ${this.current_token?.value}`
                );
                return new ASTNode(
                    "null",
                    null,
                    [],
                    false,
                    this.current_token!.line,
                    this.current_token!.column
                );
        }
    }

    parse_function_call(block_is_active: boolean = false): ASTNode {
        const func_name = this.current_token!.value;
        this.advance(); // consume function name (FUNCVAR)
        this.advance(); // consume '('

        const args: ASTNode[] = [];
        let limit = 0;
        while (this.current_token && this.current_token.kind !== "RPAREN") {
            if (limit++ > 100) {
                this.errors = [
                    `Line ${this.current_token.line}:${this.current_token.column}: Parser crashed inside a function call`,
                    "",
                ];
                this.advanceToEnd();
                break;
            }
            args.push(this.parse_expression(true, undefined, true));
            /* @ts-ignore RPAREN is expected to not appear, but we need to break it */
            if (this.current_token.kind === "RPAREN") {
                break;
            }
            if (this.current_token.kind !== "COMMA") {
                this.errors.push(
                    `Line ${this.current_token.line}:${this.current_token.column}: Expected ',' or ')' in function call, got: ${this.current_token.value}`
                );
            }
            this.advance(); // consume ',' or move to next argument
        }

        this.advance(); // consume ')'
        return new ASTNode(
            "function",
            func_name,
            args,
            block_is_active,
            this.current_token!.line,
            this.current_token!.column
        );
    }
}
