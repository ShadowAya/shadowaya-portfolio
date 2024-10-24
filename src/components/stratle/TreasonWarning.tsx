'use client';

import { useGame } from './context/GameContext';
import Dashed from './Dashed';
import styles from './TreasonWarning.module.scss';
import { useSelectedLayoutSegment } from 'next/navigation'
import cn from 'classnames';

export default function TreasonWarning() {

    const gameMeta = useGame();
    const segment = useSelectedLayoutSegment();
    
    const treasonist = (
        (gameMeta.daily.difficulty >= 4 && gameMeta.daily.inputs.length > 0 && !gameMeta.daily.didWin && !gameMeta.daily.didLose) ||
        (gameMeta.endless.difficulty >= 4 && gameMeta.endless.inputs.length > 0 && !gameMeta.endless.didWin && !gameMeta.endless.didLose)
    ) && segment === 'library';

    return <div className={cn(styles.warning, treasonist && styles.active)}>
        <Dashed width='calc(100% + 21px)' height='30px' color='#ff3232d1' />
        <div>

        </div>
        <Dashed width='calc(100% + 21px)' height='30px' color='#ff3232d1' />
        <div>
            <span>POSSIBLE TREASON DETECTED</span>
            <span>Your democracy officer has been notified</span>
        </div>
    </div>

}