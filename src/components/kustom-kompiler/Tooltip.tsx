import { type Token } from '@/utils/kustom-kompiler/lexer';
import styles from './Tooltip.module.scss';
import React, { useEffect, useState } from 'react';
import generateSuggestions, { type CursorMeta, type Suggestion } from '@/utils/kustom-kompiler/suggestiongen';
import cn from 'classnames';
import Iconify from '../Iconify';

interface TooltipProps {
    cursorMeta: CursorMeta;
    tokens: Token[];
    autocompleteFunction: (value: string, eraseBack: number, eraseForward: number) => void;
    fontSize: number;
}

export default function Tooltip({ cursorMeta, tokens, autocompleteFunction, fontSize }: TooltipProps) {

    const displayTooltip = !cursorMeta.hide || !cursorMeta.currentTokenIndex;
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {

        const suggestions = generateSuggestions(tokens, cursorMeta);
        setSuggestions(suggestions);

    }, [cursorMeta]);

    return (
        <div
            className={styles.tooltip}
            style={{
                top: cursorMeta.screenY,
                left: cursorMeta.screenX,
                display: displayTooltip ? 'block' : 'none',
                "--font-size": fontSize/2 + 'px'
            } as React.CSSProperties}
        >
            {suggestions.map((suggestion, i) => (
                <div
                    key={i}
                    className={cn(styles.row, suggestion.value && styles.hoverable)}
                    onClick={() => autocompleteFunction(suggestion.realValue ?? suggestion.value ?? '', ...(suggestion.toErase ?? [0, 0]))}
                >
                    <Iconify icon={suggestion.icon??"mdi:dot"} style={
                        suggestion.icon === null ? { visibility: 'hidden' } : {}
                    } height={24} />
                    <div>
                        <div>
                            {suggestion.value &&
                                <span className={styles.value}>{suggestion.value}</span>
                            }
                            {suggestion.description &&
                                <span className={styles.description}>{suggestion.description}</span>
                            }
                        </div>
                        {suggestion.usage &&
                            <span className={styles.usage}>{suggestion.usage.map(
                                ([value, type], i) => (
                                    <span key={i} className={cn(
                                        ...type.map(v => styles[v]),
                                        !type.length && styles.regular
                                    )}>{value}</span>
                                )
                            )}</span>
                        }
                        {suggestion.link &&
                            <a href={suggestion.link} className={styles.link} target="_blank">
                                <Iconify icon="bx:link" />
                                <span>View on the web</span>
                            </a>
                        }
                    </div>
                </div>
            ))}
        </div>
    )

}