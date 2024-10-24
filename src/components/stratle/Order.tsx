'use client';

import Image from 'next/image';
import styles from './Order.module.scss';
import cn from 'classnames';
import { useGame } from './context/GameContext';

export default function Order() {

    const gameMeta = useGame();
    const game = gameMeta[gameMeta.currentGame];

    const completions = game.completions;
    const multiple = gameMeta.currentGame === 'endless';

    const percentage = completions / (multiple ? 30 : 1) * 100;

    return (<div className={styles.order}>

        <div>
            <Image src="/hd2-order-icon.png" width={24} height={24} alt="Order" />
            <span>PERSONAL ORDER</span>
        </div>
        <div>
            <div>
                {multiple ? (<p>
                    Guess as many <span className={styles.yellow}>Stratagems</span> as you can
                </p>) : (<p>
                    Guess the <span className={styles.yellow}>Daily Stratagem</span>
                </p>)}
                <div className={cn(percentage === 100 && styles.done)} />
            </div>
            <div style={{
                '--order-percentage': percentage > 100 ? '100%' : `${percentage.toFixed(0)}%`
            }}>
                <p>
                    {completions} ({percentage.toFixed(1)}%)
                </p>
                <div />
            </div>
        </div>

    </div>)

}