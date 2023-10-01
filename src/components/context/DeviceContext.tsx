'use client';

import { useState, useEffect, createContext } from 'react';

interface DeviceContextProps {
    hasPointer: boolean;
    hasKeyboard: boolean;
}

export const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

interface DeviceProviderProps {
    children: React.ReactNode;
}

export const DeviceProvider = ({ children }: DeviceProviderProps) => {
    const [hasPointer, setHasPointer] = useState<boolean>(false);
    const [hasKeyboard, setHasKeyboard] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Pointer checks
            const pointerMatcher = window.matchMedia('(pointer: fine) and (hover: hover)');

            const updatePointerStatus = () => {
                setHasPointer(pointerMatcher.matches);
            };

            pointerMatcher.addEventListener('change', updatePointerStatus);
            updatePointerStatus();

            // Keyboard checks
            const isLikelyTouchDevice = window.matchMedia('(any-hover: none)').matches;
            setHasKeyboard(!isLikelyTouchDevice);

            const handleKeyDown = () => {
                setHasKeyboard(true);
                window.removeEventListener('keydown', handleKeyDown);
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                pointerMatcher.removeEventListener('change', updatePointerStatus);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, []);

    return (
        <DeviceContext.Provider value={{ hasPointer, hasKeyboard }}>
            {children}
        </DeviceContext.Provider>
    );
}
