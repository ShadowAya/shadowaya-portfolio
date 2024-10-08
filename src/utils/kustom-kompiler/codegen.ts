import { type ASTNode } from './parser';

export function isValidFunctionName(value: ASTNode['value']): value is keyof typeof funcNameMap {
    return typeof value === 'string' && value in funcNameMap;
}

/*

    function_name: [
        name,
        [
            arg1_name,
            [option1, option1_description],
            [option2, option2_description],
            ...
        ],
        [
            arg2_name,
            [option1, option1_description],
            [option2, option2_description],
            ...
        ],
        ...
    ]

*/

export const funcNameMap = {
    astronomicalInfo: ['ai', [
        'type',
        ['sunrise', 'Today\'s sunrise'],
        ['sunset', 'Today\'s sunset'],
        ['isday', 'Will return 1 during daylight or 0 if night'],
        ['nsunrise', 'Next sunrise'],
        ['nsunset', 'Next sunset'],
        ['mphase', 'Current Moon phase name'],
        ['zodiac', 'Current Zodiac sign name'],
        ['season', 'Current Season name'],
        ['mage', 'Current Moon age'],
        ['mill', 'Current Moon illumination (in percentage)'],
        ['moonrise', 'Moon rise'],
        ['moonset', 'Moon set'],
        ['csunrise', 'Today\'s civil sunrise'],
        ['csunset', 'Today\'s civil sunset in hh:mm format'],
        ['usunrise', 'Today\'s nautical sunrise'],
        ['usunset', 'Today\'s nautical sunset'],
        ['asunrise', 'Today\'s astronomical sunrise'],
        ['asunset', 'Today\'s astronomical sunset'],
        ['mphasec', 'Current Moon phase code, one of: NEW, WAXING_CRESCENT, FIRST_QUARTER, WAXING_GIBBOUS, FULL, WANING_GIBBOUS, THIRD_QUARTER, WANING_CRESCENT'],
        ['zodiacc', 'Current Zodiac sign code, one of: ARIES, TAURUS, GEMINI, CANCER, LEO, VIRGO, LIBRA, SCORPIO, SAGITTARIUS, CAPRICORN, AQUARIUS, PISCES'],
        ['seasonc', 'Current Season code, one of: SPRING, SUMMER, AUTUMN, WINTER'],
    ], [
        'date (optional)',
        ['r2d', '2 days ago'],
        ['a1d', 'In 1 day'],
    ]],
    airQuality: ['aq', [
        'type',
        ['index', 'Air quality index (0 = best, 400 = worst)'],
        ['label', 'Air quality level label'],
        ['level', 'Air quality level, one of:: NA, GOOD, MODERATE, UNHEALTHY_FOR_SENSITIVE, UNHEALTHY, VERY_UNHEALTHY, HAZARDOUS'],
        ['no2', 'Average No2 (µg/m³)'],
        ['pm10', 'Average PM10 (µg/m³)'],
        ['pm25', 'Average PM25 (µg/m³)'],
        ['station', 'Data station ID'],
        ['source', 'Name of the data source'],
        ['updated', 'Last data check'],
        ['collected', 'Time of data measurement'],
    ]],
    batteryInfo: ['bi', [
        'type',
        ['level', 'Battery Level (in %)'],
        ['temp', 'Battery Temperature in local unit'],
        ['tempc', 'Battery Temperature in celsius'],
        ['volt', 'Battery voltage in millivolts'],
        ['charging', 'Will return 0 if on battery, 1 if charging'],
        ['fast', 'Will return 1 if fast charging, 0 otherwise (Android 5.x or better only)'],
        ['source', 'Current power source (Battery, AC, USB or Wireless)'],
        ['plugged', 'Time of last plugged / unplugged event'],
        ['current', 'Realtime charging/discharging current in milliampere'],
        ['fullempty', 'Time of expected next charged/discharged event'],
    ], [
        'date (optional, up to 24hr)',
        ['r30m', '30 minutes ago'],
        ['r2h', '2 hours ago'],
    ]],
    bitmapPalette: ['bp', [
        'mode',
        ['muted', 'Extract muted color'],
        ['vibrant', 'Extract vibrant color'],
        ['dominant', 'Extract dominant color'],
        ['mutedbc', 'Extract muted body text color'],
        ['vibrantbc', 'Extract vibrant body text color'],
        ['mutedtc', 'Extract muted title text color'],
        ['vibranttc', 'Extract vibrant title text color'],
        ['dmuted', 'Extract muted dark color'],
        ['dvibrant', 'Extract vibrant dark color color'],
        ['dmutedbc', 'Extract muted dark body text color'],
        ['dvibrantbc', 'Extract vibrant dark body text color'],
        ['dmutedtc', 'Extract muted dark title text color'],
        ['dvibranttc', 'Extract vibrant dark title text color'],
        ['lmuted', 'Extract muted light color'],
        ['lvibrant', 'Extract vibrant light color'],
        ['lmutedbc', 'Extract muted light body text color'],
        ['lvibrantbc', 'Extract vibrant light body text color'],
        ['lmutedtc', 'Extract muted light title text color'],
        ['lvibranttc', 'Extract vibrant light title text color'],
        ['dominanttc', 'Extract dominant title text color'],
        ['dominantbc', 'Extract dominant body text color'],
    ]],
    broadcastReceive: ['br', []],
    complicationData: ['cd', []],
    colorEditor: ['ce', []],
    calendarEvents: ['ci', []],
    colorMaker: ['cm', []],
    dateFormat: ['df', []],
    dateParser: ['dp', []],
    fitnessData: ['fd', []],
    locationInfo: ['li', []],
    musicInfo: ['mi', []],
    musicQueue: ['mq', []],
    mathUtilities: ['mu', []],
    systemNotification: ['ni', []],
    networkConnectivity: ['nc', []],
    resourceMonitor: ['rm', []],
    shellCommand: ['sh', []],
    systemInfo: ['si', []],
    textConverter: ['tc', []],
    timeSpan: ['tf', []],
    trafficStats: ['ts', []],
    timerUtilities: ['tu', []],
    unreadCounters: ['uc', []],
    weatherForecast: ['wf', []],
    webGet: ['wg', []],
    currentWeather: ['wi', []],
} as const;

export default class CodeGenerator {
    ast: ASTNode[]; 

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
            `fl(${start}, ${end}, ${step}, ${body.join('')}${separator.length ? ", " : ""}${separator})`,
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
        if (!((node.value as string) in funcNameMap)) {
            throw new Error(`Line ${node.line}:${node.column}: Unknown function name: '${node.value}'${
                node.value === 'i' ? "('i' can only be used inside for-loops with basic arithmetic operations)" : ''
            }`);
        }
        let func_name = funcNameMap[node.value as keyof typeof funcNameMap][0];
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