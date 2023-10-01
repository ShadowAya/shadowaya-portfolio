'use client';

import React, { useState, useEffect, createContext } from 'react';

const KeyboardContext = createContext<Set<string>>(new Set());

interface KeyboardProviderProps {
    children: React.ReactNode;
}

const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            pressedKeys.add(event.code);
            setPressedKeys(new Set(pressedKeys));
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            pressedKeys.delete(event.code);
            setPressedKeys(new Set(pressedKeys));
        }
        const lostFocus = () => {
            pressedKeys.clear();
            setPressedKeys(new Set(pressedKeys));
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', lostFocus);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', lostFocus);
        };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardContext.Provider value={pressedKeys}>
      {children}
    </KeyboardContext.Provider>
  );
};

export { KeyboardProvider, KeyboardContext };
