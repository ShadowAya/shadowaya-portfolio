'use client'

import { useEffect, useRef, useState } from "react";

export default function PercentageText() {

    const [percentage, setPercentage] = useState<number>(0);
    const goBack = useRef<boolean>(false);

    useEffect(() => {
        const interval = setInterval(async () => {

            await new Promise((resolve) => {
                setTimeout(resolve, Math.floor(Math.random() * 1000));
            });

            setPercentage((percentage) => {
                if (percentage >= 98) {
                    goBack.current = true;
                } else if (percentage <= 0) {
                    goBack.current = false;
                }
                return goBack.current ? percentage - 1 : percentage + 1;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <p>
            {percentage}% complete
        </p>
    )

}