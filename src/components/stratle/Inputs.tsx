'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './Inputs.module.scss';
import { useGame } from './context/GameContext';
import { useStratagems } from './context/StratagemsContext';
import Box from './Box';
import Dashed from './Dashed';
import Image from 'next/image';
import { type Stratagem } from '@/utils/stratle/utils';
import Dialog from './Dialog';

export default function Inputs() {

    const stratagemMeta = useStratagems();
    const gameMeta = useGame();

    const game = gameMeta[gameMeta.currentGame];
    const stratagem = stratagemMeta.stratagems[
        gameMeta.currentGame === 'endless' ? stratagemMeta.randomIndex : stratagemMeta.todayIndex
    ];

    const [currentInputs, setCurrentInputs] = useState<('up' | 'right' | 'down' | 'left')[]>([]);
    const currentInputsRef = useRef(currentInputs);

    const [armedStratagems, setArmedStratagems] = useState<Stratagem[]>(stratagemMeta.stratagems);
    const [highlightedArrows, setHighlightedArrows] = useState<number>(0);

    useEffect(() => {
        const handler = setTimeout(() => {
            const filteredStratagems = armedStratagems.filter(stratagem => {
                return stratagem.code.join('').startsWith(currentInputs.join(''));
            });
            setHighlightedArrows(currentInputs.length);
            setArmedStratagems(filteredStratagems);
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [currentInputs, stratagemMeta.stratagems]);

    useEffect(() => {
        console.log(game);
    }, [game]);

    useEffect(() => {

        if (
            armedStratagems.length !== 1
            || armedStratagems[0].code.length !== currentInputs.length
        ) return;

        if (
            stratagem.code.join('') === currentInputs.join('')
        ) {
            // game won
            console.log('game won');
            game.won();
        } else if (game.inputs.length > 4) {
            // game lost
            console.log('game lost');
            game.lost();
        }

        game.addInput(currentInputs);
        setArmedStratagems(stratagemMeta.stratagems);
        setCurrentInputs([]);

    }, [armedStratagems]);

    function arrowPress(e: KeyboardEvent) {

        const inputs = currentInputsRef.current;

        if (inputs.length >= 8) return;

        switch (e.key) {
            case 'ArrowUp':
                setCurrentInputs(v => [...v, 'up']);
                break;
            case 'ArrowRight':
                setCurrentInputs(v => [...v, 'right']);
                break;
            case 'ArrowDown':
                setCurrentInputs(v => [...v, 'down']);
                break;
            case 'ArrowLeft':
                setCurrentInputs(v => [...v, 'left']);
                break;
        }
    }

    useEffect(() => {

        window.addEventListener('keydown', arrowPress);

        return () => {
            window.removeEventListener('keydown', arrowPress);
        }

    }, []);

    useEffect(() => {
        currentInputsRef.current = currentInputs;
    }, [currentInputs]);

    return (<div className={styles.inputs}>
        <Dialog />
        <div className={styles.arrowcontainer}>
            {game.inputs.map((arrows, i) => (
                <ArrowList key={i} arrows={arrows.map((arrow, i2) => ({
                    direction: arrow,
                    col: (stratagem.code[i2] === arrow ? 'green' : (
                        stratagem.code.includes(arrow) ? 'yellow' : 'red'
                    )) satisfies 'green' | 'yellow' | 'red',
                }))} />
            ))}
            {
                !(game.didLose || game.didWin) &&
                <ArrowList resetFn={() => {
                    setCurrentInputs([]);
                    setArmedStratagems(stratagemMeta.stratagems);
                    setHighlightedArrows(0);
                }} arrows={currentInputs.map(a => ({ direction: a, col: 'none' }))}/>
            }
        </div>
        <div className={styles.controls}>
            <div className={styles.heading}>
                <div />
                <span>ARMING</span>
                <div />
            </div>
            <Box hideTop className={styles.stratagemlist}>
                {armedStratagems.map((stratagem, i) => (
                    <div key={i} className={styles.stratagemitem}>
                        <div>{
                            stratagem.icon ? <Image
                            src={'https://helldivers.wiki.gg/' + stratagem.icon}
                            width={30}
                            height={30}
                            alt={'icon'}
                        /> : <Dashed height="30px" width="30px" small />
                        }</div>
                        <div>
                            <span>{stratagem.name}</span>
                            <div>
                                {stratagem.code.map((arrow, i) => (
                                    <Image
                                        style={{
                                            opacity: i < highlightedArrows ? 1 : 0.4
                                        }}
                                        key={i}
                                        src={`/hd2arrows/${arrow}.png`}
                                        width={16}
                                        height={16}
                                        alt={arrow}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </Box>
        </div>
    </div>)
}

interface ArrowListProps {
    arrows: {
        direction: 'up' | 'down' | 'left' | 'right';
        col: 'none' | 'red' | 'green' | 'yellow';
    }[],
    resetFn?: () => void;
    inputFn?: () => void;
}

function ArrowList({ arrows, resetFn }: ArrowListProps) {
    return (<div className={styles.arrowlist}>
        {
            arrows.map((arrow, i) => (
                <div key={i} className={styles[arrow.col]}>
                    <Image
                        src={`/hd2arrows/${arrow.direction}.png`}
                        width={32}
                        height={32}
                        alt={arrow.direction}
                    />
                </div>
            ))
        }
        {
            new Array(8 - arrows.length).fill(0).map((_, i) => (
                <div key={i} />
            ))
        }
        {resetFn &&
            <button
                className={styles.reset}
                onClick={resetFn}
            >
                <Dashed absolute='4px' />
                <span>Reset Input</span>
            </button>
        }
    </div>)
}