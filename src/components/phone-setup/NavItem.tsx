import Link from "next/link";
import styles from "./Nav.module.scss";
import cn from "classnames";

interface NavItemProps {
    href: string;
    title: string;
    active?: boolean;
}

export default function NavItem({ href, title, active }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(styles.navItem, active && styles.active)}
        >
            <span>{title}</span>
        </Link>
    );
}
