'use client';

import { useEffect } from "react";
import Box from "./Box";
import styles from "./StratagemPanel.module.scss";
import { useStratagems } from "./context/StratagemsContext";
import { useGame } from "./context/GameContext";
import Image from "next/image";
import Dashed from "./Dashed";
import { type Stratagem } from "@/utils/stratle/utils";
import cn from "classnames";

interface StratagemPanelProps {
    staticStratagem?: Stratagem;
}

export default function StratagemPanel({ staticStratagem }: StratagemPanelProps) {

    const stratagemMeta = useStratagems();
    const gameMeta = useGame();

    const game = gameMeta[gameMeta.currentGame??"daily"];
    const guesses = game.inputs.length;

    const stratagem = staticStratagem ?? stratagemMeta.stratagems[
        gameMeta.currentGame === "endless" ? stratagemMeta.randomIndex : stratagemMeta.todayIndex
    ];

    return (
        <Box className={styles.info}>
            <div className={styles.title}>
                <div>
                    <div className={styles.line} />
                    <div className={styles.titles}>
                        <IsHidden hide={!staticStratagem && guesses < 4} minwidth={100}>{stratagem.permitType.toUpperCase()}</IsHidden>
                        <IsHidden hide={!staticStratagem} minwidth={280}>{stratagem.name.toUpperCase()}</IsHidden>
                        <IsHidden hide={!staticStratagem && guesses < 2} minwidth={120}>{stratagem.module}</IsHidden>
                    </div>
                </div>
                <div className={styles.icon}>
                    {!stratagem.icon || (!staticStratagem && ((gameMeta.currentGame === 'daily' || !game.didLose) && !game.didWin)) ?
                        <Dashed height="72px" width="72px" small /> :
                        <Image
                            src={'https://helldivers.wiki.gg/' + stratagem.icon}
                            width={72}
                            height={72}
                            alt={'icon'}
                        />
                    }
                </div>
            </div>
            <div className={styles.details}>
                <Box hideTop className={styles.box}>
                    <div className={styles.heading}>
                        <div />
                        <span>STATS</span>
                        <div />
                    </div>
                    <div>
                        <div className={styles.spaced}>
                            <span>Unlock Level</span><IsHidden hide={!staticStratagem && guesses < 2} minwidth={70}>{stratagem.unlockLevel}</IsHidden>
                        </div>
                        <div className={styles.spaced}>
                            <span>Unlock Cost</span><IsHidden hide={!staticStratagem && guesses < 2} minwidth={150}>{stratagem.unlockCost}</IsHidden>
                        </div>
                        <div className={styles.spaced}>
                            <span>Cooldown</span><IsHidden hide={!staticStratagem && guesses < 3} minwidth={120}>{stratagem.cooldown === 0 ? 'N/A' : `${stratagem.cooldown} seconds`}</IsHidden>
                        </div>
                        <div className={styles.spaced}>
                            <span>Uses</span><IsHidden hide={!staticStratagem && guesses < 4} minwidth={80}>{stratagem.uses||'Unlimited'}</IsHidden>
                        </div>
                    </div>
                </Box>
                <Box hideTop className={styles.box}>
                    <div className={styles.heading}>
                        <div />
                        <span>STRATAGEM TRAITS</span>
                        <div />
                    </div>
                    <div>
                        {stratagem.traits.map((trait, i) => (
                            <div key={i} className={styles.notspaced}>
                                <IsHidden hide={!staticStratagem && (guesses < Math.min(i+2, 4) || (stratagem.traits.length === 1 && guesses < 4))} minwidth={200}>{trait}</IsHidden>
                            </div>
                        ))}
                    </div>
                </Box>
            </div>
        </Box>
    );
}

interface IsHiddenProps {
    children?: React.ReactNode;
    hide?: boolean;
    minwidth?: number;
}

function IsHidden({ children, hide, minwidth }: IsHiddenProps) {

    const gameMeta = useGame();
    const game = gameMeta[gameMeta.currentGame??"daily"];

    const isHidden = hide && ((gameMeta.currentGame === 'daily' || !game.didLose) && !game.didWin);

    return (
        <span style={{
            minWidth: isHidden ? minwidth??60 : undefined,
        }}>
            <span style={{ width: '100%' }}>{isHidden ? '‎ ' : children}</span>
            <Dashed className={cn(!isHidden && styles.fadeout)} small height="70%" width={`${minwidth??60}px`} absolute="1px" />
        </span>)
}