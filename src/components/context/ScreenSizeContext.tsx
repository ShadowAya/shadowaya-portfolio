'use client';

import { useState, useEffect, createContext } from "react";

interface ScreenContextProps {
    width: number;
    height: number;
    bigEnoughForSecondMonitor: boolean;
}

export const ScreenSizeContext = createContext<ScreenContextProps | undefined>(undefined);

interface ScreenSizeProviderProps {
    children: React.ReactNode;
}

export const ScreenSizeProvider = ({ children }: ScreenSizeProviderProps) => {
    const [screenSize, setScreenSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', updateScreenSize);
        updateScreenSize();

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    const bigEnoughForSecondMonitor = screenSize.width > 1300 ||
        screenSize.height < 700 && screenSize.width > 1050 ||
        screenSize.height < 500 && screenSize.width > 800;

    return (
        <ScreenSizeContext.Provider value={{ width: screenSize.width, height: screenSize.height, bigEnoughForSecondMonitor }}>
            {children}
        </ScreenSizeContext.Provider>
    );
}
