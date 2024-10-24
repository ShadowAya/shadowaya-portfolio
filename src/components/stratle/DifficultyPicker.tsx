'use client'

import Image from 'next/image';
import styles from './DifficultyPicker.module.scss';
import { useEffect, useState } from 'react';
import { useGame } from './context/GameContext';
import Iconify from '../Iconify';
import cn from 'classnames';

const difficultyTitles = [
    'Easy',
    'Challenging',
    'Extreme',
    'Suicide Mission',
    'Helldive',
];

const difficultyDescriptions = [
    '6 Guesses ・ Arming shown',
    '5 Guesses ・ Arming shown',
    '4 Guesses ・ Arming shown',
    '4 Guesses ・ Arming hidden',
    '3 Guesses ・ Arming hidden',
]

export default function DifficultyPicker() {

    const gameMeta = useGame();

    const game = gameMeta[gameMeta.currentGame??"daily"];

    const [previousDirection, setPreviousDirection] = useState<'L' | 'R'>('L');
    const [currentDirection, setCurrentDirection] = useState<'L' | 'R'>('L');

    const [previousDifficulty, setPreviousDifficulty] = useState<DifficultyItemProps['difficulty'] | null>(null);

    function changeDifficulty(plus: boolean) {
        
        const diff = game.difficulty;
        setPreviousDifficulty(diff);
        
        if (plus) {
            const newDiff = diff + 1;
            game.setDifficulty(
                (newDiff > 5 ?
                    1 : newDiff < 1 ? 5 : newDiff) as typeof game['difficulty']
            );
            setPreviousDirection('L');
            setCurrentDirection('R');
        } else {
            const newDiff = diff - 1;
            game.setDifficulty(
                (newDiff > 5 ?
                    1 : newDiff < 1 ? 5 : newDiff) as typeof game['difficulty']
            );
            setPreviousDirection('R');
            setCurrentDirection('L');
        }

    }

    useEffect(() => {
        setPreviousDifficulty(null);
    }, [gameMeta.currentGame])

    return <div className={styles.picker}>
        {
            game.inputs.length === 0 && <>
                <button onClick={() => changeDifficulty(false)}>
                    <Iconify icon="fe:arrow-left" height={60} />
                </button>
                <button onClick={() => changeDifficulty(true)}>
                    <Iconify icon="fe:arrow-right" height={60} />
                </button>
            </>
        }
        {
            previousDifficulty !== null &&
            <DifficultyItem
                key={previousDifficulty}
                difficulty={previousDifficulty}
                toLeft={previousDirection === 'L'}
                toRight={previousDirection === 'R'}
            />
        }
        <DifficultyItem
            key={game.difficulty}
            difficulty={game.difficulty}
            fromLeft={previousDifficulty !== null && currentDirection === 'L'}
            fromRight={previousDifficulty !== null && currentDirection === 'R'}
        />
    </div>

}

interface DifficultyItemProps {
    difficulty: 1 | 2 | 3 | 4 | 5;
    toLeft?: boolean;
    toRight?: boolean;
    fromLeft?: boolean;
    fromRight?: boolean;
}

function DifficultyItem({ difficulty, toLeft, toRight, fromLeft, fromRight }: DifficultyItemProps) {

    return <div className={cn(
        styles.item,
        toLeft && styles.toleft,
        toRight && styles.toright,
        fromLeft && styles.fromleft,
        fromRight && styles.fromright,
    )}>
        <Image
            src={`/hd2diff/${difficulty}.png`}
            height={70}
            width={140}
            alt={`difficulty ${difficulty}`}
        />
        <span>{difficulty} - {difficultyTitles[difficulty - 1]}</span>
        <span>{difficultyDescriptions[difficulty - 1]}</span>
    </div>

}