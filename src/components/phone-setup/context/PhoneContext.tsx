"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type PhoneContextType = {
  screen: string | null;
  previousScreen: string | null;
  setScreen: (screen: string | null) => void;
  isFlipped: boolean;
};

const PhoneContext = createContext<PhoneContextType>({
  screen: null,
  previousScreen: null,
  setScreen: () => {},
  isFlipped: false,
});

export function PhoneContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [screen, setScreen] = useState<string | null>(null);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);

  const segment = useSelectedLayoutSegment();

  const isFlipped = segment === "hardware";

  const setBothScreens = (newScreen: string | null) => {
    setPreviousScreen(screen);
    setScreen(newScreen);
  };

  return (
    <PhoneContext.Provider
      value={{ screen, previousScreen, setScreen: setBothScreens, isFlipped }}
    >
      {children}
    </PhoneContext.Provider>
  );
}

export function usePhoneContext() {
  return useContext(PhoneContext);
}
