'use client';

import formSentence from "@/utils/formSentence";
import ComputerWindow from "./ui/computerContents/ComputerWindow";
import { useConditionalContent } from "./ConditionalContent";

export function GuideWindow() {

    const navigateText = useConditionalContent(
        "use the left monitor to navigate pages",
        ["secondMonitorSized"]
    );

    const lookaroundText = useConditionalContent(
        "use WASD to look around",
        ['hasPointer']
    );

    return (
        <ComputerWindow width={200} height={170} top={183} left={350} delay={0.5}>
            <p>
                {
                    formSentence(
                        {capitalize: true},
                        navigateText,
                        lookaroundText
                    ) || ":)"
                }
            </p>
        </ComputerWindow>
    )

}