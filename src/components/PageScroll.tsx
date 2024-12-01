"use client";

import { useEffect, useRef } from "react";

interface PageScrollProps {
    height: number;
    children?: React.ReactNode;
}

export default function PageScroll({ height, children }: PageScrollProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        container.current?.parentElement?.scrollTo(0, 0);
    }, []);

    return (
        <div
            ref={container}
            style={{
                minHeight: height,
            }}
        >
            {children}
        </div>
    );
}
