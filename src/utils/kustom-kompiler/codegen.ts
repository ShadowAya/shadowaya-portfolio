import { type ASTNode } from './parser';

export function isValidFunctionName(value: ASTNode['value']): value is keyof typeof CodeGenerator.funcNameMap {
    return typeof value === 'string' && value in CodeGenerator.funcNameMap;
}

export default class CodeGenerator {
    ast: ASTNode[];

    static funcNameMap = {
        astronomicalInfo: ['ai'],
        airQuality: ['aq'],
        batteryInfo: ['bi'],
        bitmapPalette: ['bp'],
        broadcastReceive: ['br'],
        complicationData: ['cd'],
        colorEditor: ['ce'],
        calendarEvents: ['ci'],
        colorMaker: ['cm'],
        dateFormat: ['df'],
        dateParser: ['dp'],
        fitnessData: ['fd'],
        locationInfo: ['li'],
        musicInfo: ['mi'],
        musicQueue: ['mq'],
        mathUtilities: ['mu'],
        systemNotification: ['ni'],
        networkConnectivity: ['nc'],
        resourceMonitor: ['rm'],
        shellCommand: ['sh'],
        systemInfo: ['si'],
        textConverter: ['tc'],
        timeSpan: ['tf'],
        trafficStats: ['ts'],
        timerUtilities: ['tu'],
        unreadCounters: ['uc'],
        weatherForecast: ['wf'],
        webGet: ['wg'],
        currentWeather: ['wi'],
    } as const;

    constructor(ast: ASTNode[]) {
        this.ast = ast;
    }

    generate(): string {
        return this.visit_statements(this.ast);
    }

    visit_statements(nodes: ASTNode[]): string {
        return nodes.map((node) => this.visit(node)).join('');
    }

    visit(node: ASTNode, options?: {
        expectIterator: boolean
    }): string {
        if (Array.isArray(node)) {
            return this.visit_statements(node);
        }

        switch (node.node_type) {
            case 'if_statement':
                return this.visit_if_statement(node);
            case 'binary_expression':
                return this.visit_binary_expression(node, options);
            case 'function':
                return this.visit_function_call(node, options);
            case 'var_declaration':
                return this.visit_var_declaration(node);
            case 'local_variable':
            case 'global_variable':
                return this.visit_variable(node);
            case 'number':
                return node.value as string;
            case 'string':
                return this.visit_string(node);
            case 'for_loop':
                return this.visit_for_loop(node);
            case 'null':
                return '';
            default:
                throw new Error(`Unknown AST node type: ${node.node_type}`);
        }
    }

    wrapped_expression(expr: string, block_active: boolean): string {
        return block_active ? expr : `\$${expr}\$`;
    }

    visit_for_loop(node: ASTNode): string {
        const start = this.visit(node.children[0]);
        const end = this.visit(node.children[1]);
        const step = this.visit(node.children[2], { expectIterator: true });
        const separator = this.visit(node.children[3], { expectIterator: true });

        let i = 4;
        const body: string[] = []
        while (node.children.length > i) {
            body.push(this.visit(node.children[i++], { expectIterator: true }));
        }

        return this.wrapped_expression(
            `fl(${start}, ${end}, "${step}", ${body.join('')}${separator.length ? ", " : ""}${separator})`,
            node.block_active
        );
    }

    visit_if_statement(node: ASTNode): string {
        const condition = this.visit(node.value as ASTNode);
        const if_body = this.visit((node.children[0]));
        const else_body = node.children[1] 
            ? this.visit((node.children[1])) 
            : null; 

        if (else_body === null) {
            return this.wrapped_expression(`if(${condition}, ${if_body})`, node.block_active);
        } else {
            return this.wrapped_expression(
                `if(${condition}, ${if_body}, ${else_body})`,
                node.block_active
            );
        }
    }

    visit_binary_expression(node: ASTNode, options?: {
        expectIterator: boolean
    }): string {
        const left = this.visit(node.children[0], options);
        const right = this.visit(node.children[1], options);
        const operatorMap: { [key: string]: string } = {
            EQ: '=',
            NE: '!=',
            AND: '&',
            OR: '|',
            ADD: '+',
            SUB: '-',
            MUL: '*',
            DIV: '/',
            LT: '<',
            GT: '>',
            LE: '<=',
            GE: '>='
        };
        const operator = operatorMap[node.value as string];
        return this.wrapped_expression(`${left} ${operator} ${right}`, node.block_active);
    }

    visit_function_call(node: ASTNode, options?: {
        expectIterator?: boolean
    }): string {
        if (options?.expectIterator && node.value === 'i') {
            return 'i';
        }
        if (!((node.value as string) in CodeGenerator.funcNameMap)) {
            throw new Error(`Line ${node.line}:${node.column}: Unknown function name: '${node.value}'${
                node.value === 'i' ? "('i' can only be used inside for-loops with basic arithmetic operations)" : ''
            }`);
        }
        let func_name = CodeGenerator.funcNameMap[node.value as keyof typeof CodeGenerator.funcNameMap][0];
        const args = node.children.map((arg) => this.visit(arg)).join(', ');
        return this.wrapped_expression(`${func_name}(${args})`, node.block_active);
    }

    visit_var_declaration(node: ASTNode): string {
        const var_name = node.value;
        let expr = this.visit(node.children[0]);
        if (node.children[0].node_type === 'string') {
            expr = `"${expr}"`;
        }
        return this.wrapped_expression(`lv("${var_name}", ${expr})`, node.block_active);
    }

    visit_variable(node: ASTNode): string {
        if (node.node_type === 'local_variable')
            return this.wrapped_expression(`#${node.value}`, node.block_active);
        else {
            return this.wrapped_expression(`gv(${node.value})`, node.block_active);
        }
    }

    visit_string(node: ASTNode): string {
        let val = node.value as string;
        if (node.block_active) {
            return `"${JSON.parse(val)}"`;
        } else {
            return JSON.parse(val);
        }
    }
}