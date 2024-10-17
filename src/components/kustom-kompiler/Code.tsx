'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Code.module.scss';
import lexer, { type Token, countOccurrences } from '@/utils/kustom-kompiler/lexer';
import cn from 'classnames';

import { IBM_Plex_Mono } from 'next/font/google';
import Iconify from '../Iconify';
import CompiledBlock from './CompiledBlock';
import Tooltip from './Tooltip';
import { CursorMeta } from '@/utils/kustom-kompiler/suggestiongen';

const autoAdd = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
} as const;

// font
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: '400', variable: '--wght' });

export default function Code() {

    const [code, setCode] = useState('');
    const [codeLexed, setCodeLexed] = useState<Token[]>();
    const [toCompile, setToCompile] = useState<Token[] | null>(null);
    const [lexedError, setLexedError] = useState<string | null>(null);

    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
    const [cursorMeta, setCursorMeta] = useState<CursorMeta>({ line: 1, column: 1, screenX: 0, screenY: 0, currentTokenIndex: 0, declaredVariables: new Set(), hide: false });

    const [showSettings, setShowSettings] = useState(false);

    // settings
    const [tabSize, setTabSize] = useState(4);
    const [zoom, setZoom] = useState(0);

    const textField = useRef<HTMLTextAreaElement>(null);
    const visual = useRef<HTMLDivElement>(null);
    const positional = useRef<HTMLDivElement>(null);
    const lineNumbers = useRef<HTMLDivElement>(null);

    const markupCode = (text: string) => {
        setCode(text);
        let lexed = lexer(text);
        let rest = '';

        if (lexed.error) {
            setLexedError(`Line ${lexed.error.line}:${lexed.error.column}: Unexpected tokens`);
            if (lexed.error.line === -1) {
                lexed.tokens = [];
                rest = text;
            } else {
                rest = text.split('\n').slice(lexed.error.line! - 1).join('\n');
            }
            // console.log(lexed);
            // console.log(rest);
            // console.log(lexed.error.line, lexed.error.column);
            // console.log(text.split('\n').slice(0, lexed.error.line! - 1).join('').length + lexed.error.column!);
        } else if (lexedError !== null) setLexedError(null);
        
        localStorage.setItem('kustom-kompiler-code', text);

        if (visual.current) visual.current.innerHTML = lexed.tokens.map(token => {
            return `<span class="${styles[token.kind]}">${token.value}</span>`;
        }).join('') + `<span class="${styles.invisible}">${rest}</span>` + `<span>\n</span>`;

        setCodeLexed(lexed.tokens);
    }

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        let text = target.value;
        const typing = text.length > code.length;

        const cursor = target.selectionStart;

        if (
            typing &&
            cursor > 0
        ) {
            if (autoAdd[text[cursor - 1] as keyof typeof autoAdd]) {
                text = text.substring(0, cursor) + autoAdd[text[cursor - 1] as keyof typeof autoAdd] + text.substring(cursor);
                target.value = text;
                target.selectionStart = cursor;
                target.selectionEnd = cursor;
            }
        }

        if (
            typing &&
            cursor > 0 &&
            text[cursor - 1] === '\n'
        ) {
            const lines = text.split('\n');
            
            const line = lines[
                countOccurrences(text.substring(0, cursor), '\n') - 1
            ];
            
            let tabs = 0;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '\t') tabs++;
                else break;
            }

            if (['(', '[', '{'].includes(text[cursor - 2])) {

                text = text.substring(0, cursor) +
                    '\t'.repeat(tabs + 1) +
                    '\n' +
                    '\t'.repeat(tabs) +
                    text.substring(cursor)
                ;
                target.value = text;
                target.selectionStart = cursor + tabs + 1;
                target.selectionEnd = cursor + tabs + 1;
            } else {
                // // add tabs to the new line
                // console.log(line);
                // text = text.substring(0, cursor) + '\t'.repeat(tabs) + text.substring(cursor);
                // target.value = text;
                // target.selectionStart = cursor + tabs;
                // target.selectionEnd = cursor + tabs;
            }
        }

        markupCode(text);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

        // @todo browse linter options with arrow
        // @todo tab to insert linter suggestion
        // @todo multiple lines selected + tab = move everything
        // @todo shift tab

        const target = event.target as HTMLTextAreaElement;
        const cursor = target.selectionStart;
        const text = target.value;

        if (event.key === 'Tab') {
            event.preventDefault();
            target.value = text.substring(0, cursor) + '\t' + text.substring(cursor);
            target.selectionStart = cursor + 1;
            target.selectionEnd = cursor + 1;
            markupCode(target.value);
        }
    }

    const handleScroll = () => {
        if (!textField.current) return;
        if (visual.current) {
            visual.current.scrollTop = textField.current.scrollTop;
            visual.current.scrollLeft = textField.current.scrollLeft;
        }
        if (positional.current) {
            positional.current.scrollTop = textField.current.scrollTop;
            positional.current.scrollLeft = textField.current.scrollLeft;
        }
        if (lineNumbers.current) {
            lineNumbers.current.scrollTop = textField.current.scrollTop;
        }
        setCursorMeta(meta => ({ ...meta, hide: true }));
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        setTooltipTimeout(setTimeout(() => {
            updateCursorMeta(true);
        }, 500));
    };

    const updateCursorMeta = (alsoShow = false) => {
        const newMeta = { ...cursorMeta };

        if (textField.current) {
            if (alsoShow) newMeta.hide = false;
            newMeta.hide = textField.current.selectionStart !== textField.current.selectionEnd;
            const cursor = textField.current.selectionStart;
            const text = textField.current.value;

            newMeta.line = countOccurrences(text.substring(0, cursor), '\n') + 1;
            newMeta.column = cursor - text.lastIndexOf('\n', cursor - 1);

            if (positional.current) {
                positional.current.innerHTML = `<span>${text.substring(0, cursor)}</span><span name="anchor"></span><span>${text.substring(cursor)}\n</span>`;
                positional.current.scrollTop = textField.current.scrollTop;
                const span = positional.current.querySelector('span[name="anchor"]');
                if (span) {
                    newMeta.screenX = span.getBoundingClientRect().left;
                    newMeta.screenY = span.getBoundingClientRect().bottom;
                }
            }

            const declaredVariables = new Set<string>();
            let i = 0;
            for (i = 0; i < (codeLexed?.length??0); i++) {
                if (codeLexed![i].kind === 'LVAR' || codeLexed![i].kind === 'GVAR') declaredVariables.add(codeLexed![i].value);
                if (codeLexed![i].line === newMeta.line) {
                    if (codeLexed![i].column >= newMeta.column) {
                        newMeta.currentTokenIndex = i;
                        break;
                    }
                }
            }
            newMeta.declaredVariables.delete('#i');
            newMeta.declaredVariables = declaredVariables;

        }

        setCursorMeta(newMeta);

    };

    const tooltipAutocomplete = (value: string, eraseFront: number, eraseBack: number) => {
        const target = textField.current;
        if (!target) return;

        const cursor = target.selectionStart;
        const text = target.value;

        const before = text.substring(0, cursor - eraseFront);
        const after = text.substring(cursor + eraseBack);

        const newCursor = cursor + value.length;
        target.value = before + value + after;

        target.focus();
        target.selectionStart = newCursor;
        target.selectionEnd = newCursor;

        markupCode(target.value);

    };

    const disableScroll = (e: WheelEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        const code = localStorage.getItem('kustom-kompiler-code');
        const tabSize = localStorage.getItem('kustom-kompiler-tab-size');
        const zoom = localStorage.getItem('kustom-kompiler-zoom');
        if (code) {
            if (textField.current) textField.current.value = code;
            markupCode(code);
        }
        if (tabSize) setTabSize(parseInt(tabSize));
        
        if (zoom) setZoom(parseInt(zoom));
        else setZoom(25);

        const lineNums = lineNumbers.current;
        if (lineNums) {
            lineNums.addEventListener('wheel', disableScroll, { passive: false });
        }

        return () => {
            if (lineNums) {
                lineNums.removeEventListener('wheel', disableScroll);
            }
        }
        
    }, []);

    useEffect(() => {
        if (zoom) localStorage.setItem('kustom-kompiler-zoom', zoom.toString());
        updateCursorMeta();
    }, [zoom]);

    useEffect(() => {
        updateCursorMeta();
    }, [codeLexed]);

    return (<>
        <Tooltip
            cursorMeta={cursorMeta}
            tokens={codeLexed??[]}
            autocompleteFunction={tooltipAutocomplete}
            fontSize={zoom}
        />
        <div className={cn(styles.code, ibmPlexMono.variable)}>
            <div style={{
                fontSize: `${zoom}px`
            }}>
                <textarea
                    ref={textField}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    onSelect={() => updateCursorMeta()}
                    style={{
                        tabSize: tabSize,
                        fontSize: `${zoom}px`
                    }}
                />
                <div
                    className={styles.visual}
                    ref={visual}
                    style={{
                        tabSize: tabSize,
                        fontSize: `${zoom}px`
                    }}
                />
                <div
                    className={styles.positional}
                    ref={positional}
                    style={{
                        tabSize: tabSize,
                        fontSize: `${zoom}px`
                    }}
                />
                <div
                    className={styles.controls}
                >
                    <button
                        onClick={() => setToCompile(codeLexed??null)}
                    >
                        <Iconify
                            icon="material-symbols:build"
                            height={30}
                        />
                    </button>
                    <button
                        onClick={() => {
                            if (zoom > 80) return;
                            setZoom(z => z + 5);
                        }}
                    >
                        <Iconify
                            icon="tabler:zoom-in-filled"
                            height={30}
                        />
                    </button>
                    <button
                        onClick={() => {
                            if (zoom < 30) return;
                            setZoom(z => z - 5);
                        }}
                    >
                        <Iconify
                            icon="tabler:zoom-out-filled"
                            height={30}
                        />
                    </button>
                    <button
                        onClick={() => setShowSettings(v => !v)}
                    >
                        <Iconify
                            icon="ic:round-menu"
                            height={30}
                        />
                    </button>
                </div>
                <div
                    className={styles.settings}
                    style={{
                        display: showSettings ? 'flex' : 'none'
                    }}
                >
                    <div>
                        <label
                            htmlFor="tab-size"
                        >Tab size</label>
                        <input
                            name="tab-size"
                            type="number"
                            value={tabSize}
                            onChange={event => {
                                const tabSize = Math.max(1, Math.min(8, parseInt(event.target.value)));
                                localStorage.setItem('kustom-kompiler-tab-size', tabSize.toString());
                                setTabSize(tabSize);
                            }}
                        />
                    </div>
                    <a href="kustom-kompiler/docs" target='_blank'>
                        <label>Check the docs</label>
                        <Iconify icon="ic:round-open-in-new" height={24} />
                    </a>
                    <div>
                        <label style={{
                            color: '#ffffff92'
                        }}>Work in progress!</label>
                    </div>
                </div>
                <div
                    className={styles.lines}
                    ref={lineNumbers}
                    style={{
                        top: `${16 - zoom/8}px`,
                    }}
                >{
                    code.split('\n').map((line, i) => (
                        <div
                            key={i}
                            className={styles.line}
                        ><span style={{
                            fontSize: `${zoom/2}px`
                        }}>{i+1}</span></div>
                    ))
                }</div>
            </div>
            <CompiledBlock
                tokens={toCompile}
                lexedError={lexedError}
            />
        </div>
    </>)

}