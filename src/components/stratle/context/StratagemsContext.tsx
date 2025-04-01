"use client";

import { type Stratagem } from "@/utils/stratle/utils";
import { createContext, useContext, useEffect, useState } from "react";

type KeyLocator<T, Prefix extends string = ""> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? KeyLocator<T[K], `${Prefix}${K & string}.`>
        : `${Prefix}${K & string}`;
    }[keyof T]
  : never;

type Settings = {
  controls: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
};

const defaultSettings: Settings = {
  controls: {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
  },
};

export type SettingsKeys = KeyLocator<Settings>;

interface StratagemsContextType {
  stratagems: Stratagem[];
  todayIndex: number;
  randomIndex: number;
  updateRandomIndex: () => void;
  settings: Settings;
  updateSettings: (key: SettingsKeys, value: string) => void;
  settingsRecording: boolean;
  setSettingsRecording: (recording: boolean) => void;
}

function randomFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const StratagemsContext = createContext<StratagemsContextType | undefined>(
  undefined
);

export default StratagemsContext;

export function useStratagems() {
  const context = useContext(StratagemsContext);
  if (!context) {
    throw new Error("useStratagems must be used within a StratagemsProvider");
  }
  return context;
}

export function StratagemProvider({
  children,
  stratagems,
  todayIndex,
}: {
  children: React.ReactNode;
  stratagems: Stratagem[];
  todayIndex: number;
}) {
  const readSettings = () => {
    const settings = localStorage.getItem("stratagems-settings");
    if (settings) {
      return JSON.parse(settings) as StratagemsContextType["settings"];
    } else {
      localStorage.setItem(
        "stratagems-settings",
        JSON.stringify(defaultSettings)
      );
      return defaultSettings;
    }
  };

  const [randomIndex, setRandomIndex] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsRecording, setSettingsRecording] = useState(false);

  const updateRandomIndex = () => {
    setRandomIndex(randomFromRange(0, stratagems.length - 1));
  };

  const updateSettings = (key: SettingsKeys, value: string) => {
    const parts = key.split(".");
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      // @ts-expect-error is valid key
      current = current[parts[i]];
    }
    // @ts-expect-error is valid key
    current[parts[parts.length - 1]] = value;
    setSettings(newSettings);
    localStorage.setItem("stratagems-settings", JSON.stringify(newSettings));
  };

  useEffect(() => {
    setSettings(readSettings());
    setRandomIndex(randomFromRange(0, stratagems.length - 1));
  }, []);

  return (
    <StratagemsContext.Provider
      value={{
        stratagems,
        todayIndex: stratagems[todayIndex].code.length
          ? todayIndex
          : todayIndex + 1,
        randomIndex: stratagems[randomIndex].code.length
          ? randomIndex
          : randomIndex + 1,
        updateRandomIndex,
        settings,
        updateSettings,
        settingsRecording,
        setSettingsRecording,
      }}
    >
      {children}
    </StratagemsContext.Provider>
  );
}
