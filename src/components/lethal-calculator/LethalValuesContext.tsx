'use client';

import { Dispatch, createContext, useContext, useState } from "react";

export const shopCosts = {
    // Equipment
    Boombox: 60,
    "Extension Ladder": 60,
    Flashlight: 15,
    Jetpack: 700,
    Lockpicker: 20,
    "Pro-Flashlight": 25,
    "Radar-Booster": 60,
    Shovel: 30,
    "Spray Paint": 50,
    "Stun Grenade": 30,
    "TZP-Inhalant": 120,
    "Walkie-Talkie": 12,
    "Zap Gun": 400,

    // Ship upgrades
    Teleporter: 375,
    "Inverse Teleporter": 425,
    "Loud Horn": 100,
    "Signal Translator": 255,

    // Suits
    "Purple Suit": 70,
    "Green Suit": 60,
    "Hazard Suit": 90,
    "Pajama Suit": 900,
    "Bee Suit": 110,
    "Bunny Suit": 200,

    // Ship Decorations
    "Cozy Lights": 140,
    Goldfish: 50,
    "Jack O'Lantern": 50,
    Television: 130,
    "Record Player": 120,
    "Romantic Table": 120,
    Shower: 180,
    Table: 70,
    Toilet: 150,
    "Welcome Mat": 40,
    "Plushie Pijama Man": 100,
    "Disco Ball": 150,
} as const;

type ShopItems = Record<keyof typeof shopCosts, number>;
type Sales = {
    Boombox: number,
    "Extension Ladder": number,
    Flashlight: number,
    Jetpack: number,
    Lockpicker: number,
    "Pro-Flashlight": number,
    "Radar-Booster": number,
    Shovel: number,
    "Spray Paint": number,
    "Stun Grenade": number,
    "TZP-Inhalant": number,
    "Walkie-Talkie": number,
    "Zap Gun": number,
}

interface LethalValues {
    profitQuota: number;
    deadline: number;
    currentCredits: number;
    shopContents: ShopItems;
    sales: Sales;
    extraCustomItemsCost: number;
    moonCost: number;
    setParams: (params: Partial<Omit<LethalValues, "shopContents">>) => void;
    setShopItem: (item: { item: keyof typeof shopCosts, amount: number }) => void;
    setSale: (item: keyof Sales, amount: number) => void;
}

const LethalValues = createContext<LethalValues | undefined>(undefined);

export function LethalValuesProvider({ children }: { children: React.ReactNode }) {

    const [profitQuota, setProfitQuota] = useState(130);
    const [deadline, setDeadline] = useState(0);
    const [currentCredits, setCurrentCredits] = useState(0);
    const [moonCost, setMoonCost] = useState(0);

    const [extraCustomItemsCost, setExtraCustomItemsCost] = useState(0);

    const [shopContents, setShopContents] = useState<ShopItems>(
        Object.keys(shopCosts).reduce((acc, key) => {
            acc[key as keyof typeof shopCosts] = 0;
            return acc;
        }, {} as ShopItems)
    );

    const [sales, setSales] = useState<Sales>({
        Boombox: 0,
        "Extension Ladder": 0,
        Flashlight: 0,
        Jetpack: 0,
        Lockpicker: 0,
        "Pro-Flashlight": 0,
        "Radar-Booster": 0,
        Shovel: 0,
        "Spray Paint": 0,
        "Stun Grenade": 0,
        "TZP-Inhalant": 0,
        "Walkie-Talkie": 0,
        "Zap Gun": 0,
    })

    const setParams = (params: Partial<Omit<LethalValues, "shopContents" | "sales">>) => {
        if (params.profitQuota !== undefined) {
            setProfitQuota(params.profitQuota);
        }
        if (params.deadline !== undefined) {
            setDeadline(params.deadline);
        }
        if (params.currentCredits !== undefined) {
            setCurrentCredits(params.currentCredits);
        }
        if (params.extraCustomItemsCost !== undefined) {
            setExtraCustomItemsCost(params.extraCustomItemsCost);
        }
        if (params.moonCost !== undefined) {
            setMoonCost(params.moonCost);
        }
    };

    const setShopItem = ({ item, amount }: { item: keyof typeof shopCosts, amount: number }) => {
        setShopContents((prev) => {
            const newContents = { ...prev };
            newContents[item] = amount;
            return newContents;
        });
    };

    const setSale = (item: keyof Sales, amount: number) => {
        setSales((prev) => {
            const newSales = { ...prev };
            newSales[item] = amount;
            return newSales;
        });
    };

    return (
        <LethalValues.Provider value={{
            profitQuota, deadline, currentCredits, shopContents, sales, extraCustomItemsCost, moonCost,
            setParams, setShopItem, setSale
        }}>
            {children}
        </LethalValues.Provider>
    );
}

export function useLethalValues() {
    const context = useContext(LethalValues);
    if (context === undefined) {
        return undefined;
    }
    return context;
}
