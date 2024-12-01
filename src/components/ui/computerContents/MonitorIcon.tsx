import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import Iconify from "../../Iconify";
import style from "./MonitorIcon.module.scss";
import Link from "next/link";

interface MonitorIconProps {
    icon: string | IconifyIcon;
    title: string;
    href?: string;
    top?: number;
    left?: number;
    right?: number;
}

export default function MonitorIcon({
    icon,
    title,
    href,
    top = 0,
    left = 0,
    right = 0,
}: MonitorIconProps) {
    const contents = (
        <>
            <Iconify width={35} icon={icon} />
            <span>{title}</span>
        </>
    );

    return (
        <div
            className={style.icon}
            style={{
                top,
                left,
                right,
            }}
        >
            {href ? (
                <Link href={href} scroll={false}>
                    {contents}
                </Link>
            ) : (
                contents
            )}
        </div>
    );
}
