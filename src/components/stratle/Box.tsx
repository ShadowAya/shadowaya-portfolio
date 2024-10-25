'use client';

import cn from "classnames";
import styles from './Box.module.scss';

interface BoxProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    hideTop?: boolean;
    hideRight?: boolean;
    hideBottom?: boolean;
    hideLeft?: boolean;
    highlight?: boolean;
}

export default function Box({
    children,
    className,
    style,
    hideTop = false,
    hideRight = false,
    hideBottom = false,
    hideLeft = false,
    highlight = false,
}: BoxProps) {
    return <div
        className={cn(className, styles.box)}
        style={{
            borderTop: hideTop ? 'none' : undefined,
            borderRight: hideRight ? 'none' : undefined,
            borderBottom: hideBottom ? 'none' : undefined,
            borderLeft: hideLeft ? 'none' : undefined,
            '--box-border-col': highlight ? '#ffffff' : '#ffffff64',
            ...style
        }}
    >
        {children}
    </div>
}