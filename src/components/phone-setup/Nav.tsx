"use client";

import NavItem from "./NavItem";
import styles from "./Nav.module.scss";
import { useSelectedLayoutSegment } from "next/navigation";

const pages = [
    { href: "apps", title: "Apps" },
    { href: "hardware", title: "Hardware" },
    { href: "homescreen", title: "Homescreen" },
    { href: "tasker", title: "Tasker" },
];

export default function Nav() {
    const segment = useSelectedLayoutSegment();

    return (
        <nav className={styles.nav}>
            {pages.map((page) => (
                <NavItem
                    key={page.title}
                    title={page.title}
                    href={`/phone-setup/${page.href}`}
                    active={segment === page.href}
                />
            ))}
        </nav>
    );
}
