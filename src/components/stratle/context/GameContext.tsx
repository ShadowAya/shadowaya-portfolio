'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useStratagems } from "./StratagemsContext";

type Game = {
    completions: number;
    inputs: ('up' | 'right' | 'down' | 'left')[][];
    addInput: (input: ('up' | 'right' | 'down' | 'left')[]) => void;
    didWin: boolean;
    won: (reset?: boolean) => void;
    didLose: boolean;
    lost: () => void;
    restart: () => void;
}

interface GameContextType {
    daily: Game;
    endless: Game;
    currentGame: 'daily' | 'endless';
    changeMode: (mode: 'daily' | 'endless') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export default GameContext;

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {

    const stratagemMeta = useStratagems();
    
    const [completionsDaily, setCompletionsDaily] = useState(0);
    const [completionsEndless, setCompletionsEndless] = useState(0);

    const [inputsDaily, setInputsDaily] = useState<('up' | 'right' | 'down' | 'left')[][]>([]);
    const [inputsEndless, setInputsEndless] = useState<('up' | 'right' | 'down' | 'left')[][]>([]);

    const [didLoseDaily, setDidLoseDaily] = useState(false);
    const [didLoseEndless, setDidLoseEndless] = useState(false);

    const [didWinDaily, setDidWinDaily] = useState(false);
    const [didWinEndless, setDidWinEndless] = useState(false);

    function wonDaily(reset = false) {
        if (reset) {
            setDidWinDaily(false);
            setInputsEndless([]);
        } else {
            setCompletionsDaily(v => v + 1);
            setDidWinDaily(true);
        }
    }

    function wonEndless(reset = false) {
        if (reset) {
            setDidWinEndless(false);
            setInputsEndless([]);
            stratagemMeta.updateRandomIndex();
        } else {
            setCompletionsEndless(v => v + 1);
            setDidWinEndless(true);
        }
    }

    function restartDaily() {
        setInputsDaily([]);
        setCompletionsDaily(0);
        setDidLoseDaily(false);
        setDidWinDaily(false);
    }

    function restartEndless() {
        setInputsEndless([]);
        setCompletionsEndless(0);
        setDidLoseEndless(false);
        setDidWinEndless(false);
    }

    function lostDaily() {
        setDidLoseDaily(true);
    }

    function lostEndless() {
        setDidLoseEndless(true);
    }

    const [currentGame, setCurrentGame] = useState<'daily' | 'endless'>('daily');

    function changeMode(mode: 'daily' | 'endless') {
        setCurrentGame(mode);
    }

    function addInputDaily(input: ('up' | 'right' | 'down' | 'left')[]) {
        setInputsDaily(v => [...v, input]);
    }

    function addInputEndless(input: ('up' | 'right' | 'down' | 'left')[]) {
        setInputsEndless(v => [...v, input]);
    }
    
    return (
        <GameContext.Provider value={{
            currentGame,
            changeMode,
            daily: {
                completions: completionsDaily,
                inputs: inputsDaily,
                addInput: addInputDaily,
                didLose: didLoseDaily,
                lost: lostDaily,
                restart: restartDaily,
                didWin: didWinDaily,
                won: wonDaily,
            },
            endless: {
                completions: completionsEndless,
                inputs: inputsEndless,
                addInput: addInputEndless,
                didLose: didLoseEndless,
                lost: lostEndless,
                restart: restartEndless,
                didWin: didWinEndless,
                won: wonEndless,
            },
        }}>
            {children}
        </GameContext.Provider>
    );
}