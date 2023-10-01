'use client';

import { useContext, useRef, useState } from 'react';
import styles from './Monitors.module.scss';
import cn from 'classnames';
import { ScreenSizeContext } from '../context/ScreenSizeContext';

interface MonitorProps {
    children?: React.ReactNode;
    extraOnCondition?: boolean;
}

function Monitor({children, extraOnCondition = true, className}: MonitorProps & {className?: string}) {

    const [isOn, setIsOn] = useState(true);
    const button = useRef<HTMLDivElement>(null);

    return (
        <div className={className}>
            <div
                className={cn(!(isOn && extraOnCondition) && styles.off)}
            >{children}</div>
            <div>
                <div />
                <div
                    ref={button}
                    onClick={() => {
                        setIsOn(v => !v);
                    }}
                />
            </div>
        </div>
    )
}

export function MonitorMain({children}: MonitorProps) {

    return (
        <Monitor className={styles['monitor-main']}>
            {children}
        </Monitor>
    )

}

export function MonitorSecondary({children}: MonitorProps) {

    const bigEnough = useContext(ScreenSizeContext)?.bigEnoughForSecondMonitor;

    return (
        <Monitor
        extraOnCondition={
            bigEnough
        }
        className={styles['monitor-secondary']}>
            <div><div>{children}</div></div>
        </Monitor>
    )

}