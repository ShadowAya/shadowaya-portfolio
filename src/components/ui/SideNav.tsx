'use client';

import Link from 'next/link';
import Iconify from '../Iconify';
import styles from './SideNav.module.scss';
import { useContext } from 'react';
import { ScreenSizeContext } from '../context/ScreenSizeContext';

interface SideNavProps {
    items: {
        icon: string;
        title: string;
        href: string;
    }[];
}

export default function SideNav({ items }: SideNavProps) {

    const screen = useContext(ScreenSizeContext);

    if (screen?.bigEnoughForSecondMonitor) return null;

    return (
        <div className={styles.container}>
            <div />
            {items.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={styles.item}
                >
                    <Iconify icon={item.icon} color="white" width="30" />
                    <p>
                        {item.title}
                    </p>
                </Link>
            ))}
        </div>

    )

}