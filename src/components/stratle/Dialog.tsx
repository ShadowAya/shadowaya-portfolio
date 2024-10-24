'use client';

import Box from './Box';
import { useGame } from './context/GameContext';
import { useStratagems } from './context/StratagemsContext';
import styles from './Dialog.module.scss';
import cn from 'classnames';

export default function Dialog() {

    const stratagemMeta = useStratagems();
    const gameMeta = useGame();

    const mode = gameMeta.currentGame;
    const game = gameMeta[mode];
    // const stratagem = stratagemMeta.stratagems[
    //     gameMeta.currentGame === 'endless' ? stratagemMeta.randomIndex : stratagemMeta.todayIndex
    // ];

    return (
        <div className={cn(
            styles.dialog,
            game.didLose || game.didWin ? styles.show : styles.hide
        )}>
            { game.didLose &&
                <Box>
                    <h1>GAME OVER</h1>
                    <p>You couldn't guess the stratagem in time</p>
                    <button
                        onClick={() => game.restart()}
                    >
                        Try Again
                    </button>
                </Box>
            }
            { game.didWin &&
                <Box>
                    <h1>{mode === 'daily' ?"GAME WON" : "STRATAGEM GUESSED"}</h1>
                    <p>You guessed the stratagem correctly</p>
                    {
                        mode === 'daily' ? (
                        <button
                            onClick={() => game.restart()}
                        >
                            Confirm
                        </button>) : (
                        <button
                            onClick={() => game.won(true)}
                        >
                            Next
                        </button>)
                    }
                </Box>
            }
        </div>
    )

}