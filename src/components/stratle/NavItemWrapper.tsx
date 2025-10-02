"use client";

import Link from "next/link";
import { useGame } from "./context/GameContext";
import styles from "./NavItem.module.scss";
import cn from "classnames";
import { useTransition } from "react";

type NavItemWrapperProps = {
    children: React.ReactNode;
    link: string;
    setMode?: "daily" | "endless";
    selected?: boolean;
};

export default function NavItemWrapper({
    children,
    link,
    setMode,
    selected,
}: NavItemWrapperProps) {
    const game = useGame();
    const [isPending, startTransition] = useTransition();

    return (
        <Link
            className={cn(styles.item, selected && styles.selected)}
            href={link}
            onClick={() => {
                startTransition(() => setMode && game.changeMode(setMode));
            }}
        >
            {children}
        </Link>
    );
}
