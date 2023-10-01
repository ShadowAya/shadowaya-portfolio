'use client';

import cn from 'classnames';
import styles from './TopWarning.module.scss';
import formSentence from '@/utils/formSentence';
import Iconify from '../Iconify';
import { useContext, useState } from 'react';
import { ScreenSizeContext } from '../context/ScreenSizeContext';
import { DeviceContext } from '../context/DeviceContext';

export default function TopWarning() {

    const device = useContext(DeviceContext);
    const noPointer = !device?.hasPointer;
    const noKeyboard = !device?.hasKeyboard;

    const screenSize = useContext(ScreenSizeContext);
    const tooSmall = screenSize && screenSize.width < 800;

    const anyWarning = noPointer || noKeyboard || tooSmall;

    const [closed, setClosed] = useState(false);

    return (
        <div className={cn(
            styles.warning,
            anyWarning && !closed && styles.visible,
        )}>
            <p>
                {"This site is designed primarily for "}
                {formSentence(
                    {bold: true},
                    noPointer && "pointers",
                    noKeyboard && "keyboards",
                    tooSmall && "larger screens",
                )}
            </p>
            <Iconify icon="material-symbols:close" height={20} onClick={() => {setClosed(true)}}/>
        </div>
    )

}