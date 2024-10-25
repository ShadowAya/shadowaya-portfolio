'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import styles from "./TouchControls.module.scss";
import Image from "next/image";
import Iconify from "../Iconify";
import { useGame } from "./context/GameContext";

interface TouchControlsProps {
    setInput: Dispatch<SetStateAction<("up" | "down" | "left" | "right")[]>>
}

export default function TouchControls({ setInput }: TouchControlsProps) {

    const gameMeta = useGame();
    const game = gameMeta[gameMeta.currentGame];

    const [showControls, setShowControls] = useState(false);

    useEffect(() => {

        if ('ontouchstart' in document.documentElement) {
            setShowControls(true);
        }

    }, []);

    if (!showControls) return null;

    return (
        <div className={styles.controls}>
            <button onClick={() => setInput(v => [...v, 'up'])}>
                <Image src="/hd2arrows/up.png" width={24} height={24} alt="up" />
            </button>
            <button onClick={() => setInput(v => [...v, 'down'])}>
                <Image src="/hd2arrows/down.png" width={24} height={24} alt="down" />
            </button>
            <button onClick={() => setInput(v => [...v, 'left'])}>
                <Image src="/hd2arrows/left.png" width={24} height={24} alt="left" />
            </button>
            <button onClick={() => setInput(v => [...v, 'right'])}>
                <Image src="/hd2arrows/right.png" width={24} height={24} alt="right" />
            </button>
            <button onClick={() => setInput(v => v.slice(0, -1))}>
                <Iconify icon="mdi:erase" height={24} color={'#d6d6d6'} />
            </button>
        </div>
    )

}