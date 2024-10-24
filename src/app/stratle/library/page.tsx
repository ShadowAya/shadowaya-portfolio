'use client'

import StratagemPanel from '@/components/stratle/StratagemPanel';
import styles from './page.module.scss';
import { useState } from 'react';
import { useStratagems } from '@/components/stratle/context/StratagemsContext';
import Image from 'next/image';
import cn from 'classnames';

export default function Page() {

    const stratagemMeta = useStratagems();
    const stratagems = stratagemMeta.stratagems;

    const [selectedStratagemIndex, setSelectedStratagemIndex] = useState<number | null>(null);

    const selectedStratagem = 
        (selectedStratagemIndex !== null && selectedStratagemIndex > -1 && selectedStratagemIndex < stratagems.length) ?
        stratagems[selectedStratagemIndex] : null;

    return (
        <div className={styles.page}>
            <div>
                <div className={styles.heading}>
                    <div />
                    <span>STRATAGEM LIST</span>
                    <div />
                </div>
                <div className={styles.content}>
                    {
                        stratagems.map((stratagem, index) => (
                            <a className={cn(
                                styles.item, selectedStratagemIndex === index && styles.selected
                            )} key={stratagem.name} onClick={() => setSelectedStratagemIndex(index)}>
                                <div>
                                    {
                                        stratagem.icon && <Image
                                            src={'https://helldivers.wiki.gg/' + stratagem.icon}
                                            width={38}
                                            height={38}
                                            alt="icon"
                                        />
                                    }
                                    <span>{stratagem.name}</span>
                                </div>
                                <div>
                                    {
                                        stratagem.code.map((code, index) => (
                                            <Image
                                                key={index}
                                                src={`/hd2arrows/${code}.png`}
                                                width={24}
                                                height={24}
                                                alt={code}
                                            />
                                        ))
                                    }
                                </div>
                            </a>
                        ))
                    }
                </div>
            </div>
            <div>
                {
                    selectedStratagem !== null && <StratagemPanel staticStratagem={selectedStratagem} />
                }
            </div>
        </div>
    );
}