'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useStratagems } from "./StratagemsContext";

type Game = {
    completions: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    /*
        1 - 6 guesses
        2 - 5 guesses
        3 - 4 guesses
        4 - 4 guesses & arming hidden
        5 - 3 guesses & arming hidden
    */
    setDifficulty: (difficulty: 1 | 2 | 3 | 4 | 5) => void;
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

    const inputsDailyRef = useRef(inputsDaily);
    const inputsEndlessRef = useRef(inputsEndless);

    const [didLoseDaily, setDidLoseDaily] = useState(false);
    const [didLoseEndless, setDidLoseEndless] = useState(false);

    const [didWinDaily, setDidWinDaily] = useState(false);
    const [didWinEndless, setDidWinEndless] = useState(false);

    const [currentGame, setCurrentGame] = useState<'daily' | 'endless' | null>(null);

    const [difficultyDaily, setDifficultyDaily] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
    const [difficultyEndless, setDifficultyEndless] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

    useEffect(() => {
        inputsDailyRef.current = inputsDaily;
    }, [inputsDaily]);

    useEffect(() => {
        inputsEndlessRef.current = inputsEndless;
    }, [inputsEndless]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (inputsDailyRef.current.length > 0 || inputsEndlessRef.current.length > 0) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {

        const lastDifficulty = localStorage.getItem('stratle_difficulty_daily');
        if (lastDifficulty) {
            setDifficultyDaily(parseInt(lastDifficulty) as 1 | 2 | 3 | 4 | 5);
        } else {
            setDifficultyDaily(1);
        }

        const lastDifficultyEndless = localStorage.getItem('stratle_difficulty_endless');
        if (lastDifficultyEndless) {
            setDifficultyEndless(parseInt(lastDifficultyEndless) as 1 | 2 | 3 | 4 | 5);
        } else {
            setDifficultyEndless(1);
        }

    }, []);

    useEffect(() => {
        if (difficultyDaily) {
            localStorage.setItem('stratle_difficulty_daily', difficultyDaily.toString());
        }
    }, [difficultyDaily]);

    useEffect(() => {
        if (difficultyEndless) {
            localStorage.setItem('stratle_difficulty_endless', difficultyEndless.toString());
        }
    }, [difficultyEndless]);

    function setValueDifficultyDaily(difficulty: 1 | 2 | 3 | 4 | 5) {
        setDifficultyDaily(difficulty);
    }

    function setValueDifficultyEndless(difficulty: 1 | 2 | 3 | 4 | 5) {
        setDifficultyEndless(difficulty);
    }

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
            currentGame: currentGame??'daily',
            changeMode,
            daily: {
                completions: completionsDaily,
                difficulty: difficultyDaily??1,
                setDifficulty: setValueDifficultyDaily,
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
                difficulty: difficultyEndless??1,
                setDifficulty: setValueDifficultyEndless,
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