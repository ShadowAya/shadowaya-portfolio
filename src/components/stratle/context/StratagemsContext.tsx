'use client';

import { type Stratagem } from "@/utils/stratle/utils";
import { createContext, useContext, useEffect, useState } from "react";

interface StratagemsContextType {
    stratagems: Stratagem[];
    todayIndex: number;
    randomIndex: number;
    updateRandomIndex: () => void;
}

function randomFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const StratagemsContext = createContext<StratagemsContextType | undefined>(undefined);

export default StratagemsContext;

export function useStratagems() {
    const context = useContext(StratagemsContext);
    if (!context) {
        throw new Error("useStratagems must be used within a StratagemsProvider");
    }
    return context;
}

export function StratagemProvider({ children, stratagems, todayIndex }: { children: React.ReactNode, stratagems: Stratagem[], todayIndex: number }) {
    
    const [randomIndex, setRandomIndex] = useState(0);

    const updateRandomIndex = () => {
        setRandomIndex(randomFromRange(0, stratagems.length - 1));
    };

    useEffect(() => {
        setRandomIndex(randomFromRange(0, stratagems.length - 1));
    }, []);
    
    return (
        <StratagemsContext.Provider value={{ stratagems, todayIndex, randomIndex, updateRandomIndex }}>
            {children}
        </StratagemsContext.Provider>
    );
}