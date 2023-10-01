'use client';

import { useContext } from "react";
import { ScreenSizeContext } from "./context/ScreenSizeContext";
import { DeviceContext } from "./context/DeviceContext";

type Conditions = (
    'secondMonitorSized' |
    'hasPointer' |
    'hasKeyboard'
)[];

export function useConditionalContent<T>(
    content: T,
    conditions: Conditions = []
): T | null {

    const isBigEnoughForSecondMonitor = useContext(ScreenSizeContext)?.bigEnoughForSecondMonitor;
    const device = useContext(DeviceContext);

    const conditionCheck =
        (!conditions.includes('secondMonitorSized') || isBigEnoughForSecondMonitor) &&
        (!conditions.includes('hasPointer') || device?.hasPointer) &&
        (!conditions.includes('hasKeyboard') || device?.hasKeyboard);

    return conditionCheck ? content : null;
}

interface AsConditionalContentProps {
    children: React.ReactNode;
    conditions: Conditions;
}

export function AsConditionalContent({ children, conditions }: AsConditionalContentProps){

    return useConditionalContent(children, conditions);

}