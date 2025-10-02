'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import Box from './Box'
import styles from './Nav.module.scss'
import NavItem from './NavItem'
import { useGame } from './context/GameContext';
import DifficultyPicker from './DifficultyPicker';

export default function Nav() {

    const segment = useSelectedLayoutSegment();
    const game = useGame();

    return <div className={styles.nav}>
        <div>
            <NavItem link="/stratle/game" setMode="daily" title="Daily" num={1} selected={('game' === segment && game.currentGame === 'daily') || !game.currentGame} />
            <NavItem link="/stratle/game" setMode="endless" title="Endless" num={2} selected={'game' === segment && game.currentGame === 'endless'} />
            <NavItem link="/stratle/library" title="Library" num={3} selected={'library' === segment} />
        </div>
        {
            segment === 'game' &&
            <DifficultyPicker />
        }
    </div>

}