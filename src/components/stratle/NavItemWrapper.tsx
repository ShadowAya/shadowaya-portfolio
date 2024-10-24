'use client';

import Link from "next/link";
import { useGame } from "./context/GameContext";
import styles from './NavItem.module.scss'
import cn from 'classnames';
import { useRouter } from "next/navigation";

type NavItemWrapperProps = {
    children: React.ReactNode;
    link?: string;
    setMode?: 'daily' | 'endless';
    selected?: boolean;
}

export default function NavItemWrapper({ children, link, setMode, selected }: NavItemWrapperProps) {

    const game = useGame();
    const router = useRouter();

    if (link) {
        return (
            <Link className={cn(styles.item, selected && styles.selected)} href={link}>
                {children}
            </Link>
        )
    } else {
        return (
            <a className={cn(styles.item, selected && styles.selected)} onClick={() => {
                game.changeMode(setMode!);
                if (window.location.pathname !== '/stratle/game') {
                    router.push('/stratle/game');
                }
            }}>
                {children}
            </a>
        )
    }
}