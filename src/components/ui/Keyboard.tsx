'use client';

import Keys from "@/components/ui/keyboardParts/Keys";
import styles from "./Keyboard.module.scss";
import Spacer from "@/components/ui/keyboardParts/Spacer";
import RepeatContent from "@/components/RepeatContent";
import { KeyboardContext } from "@/components/context/KeyboardContext";
import { useContext, useEffect, useRef } from "react";

const allKeys = [
    [
        "Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
        "F9", "F10", "F11", "F12", "PrintScreen", "ScrollLock", "Pause"
    ],
    [
        "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
        "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal",
        "Backspace", "Insert", "Home", "PageUp", "NumLock", "NumpadDivide",
        "NumpadMultiply", "NumpadSubtract"
    ],
    [
        "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU",
        "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash",
        "Delete", "End", "PageDown", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd"
    ],
    [
        "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ",
        "KeyK", "KeyL", "Semicolon", "Quote", "Enter", "Numpad4", "Numpad5",
        "Numpad6"
    ],
    [
        "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM",
        "Comma", "Period", "Slash", "ShiftRight", "ArrowUp", "Numpad1",
        "Numpad2", "Numpad3", "NumpadEnter"
    ],
    [
        "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight",
        "ContextMenu", "ControlRight", "ArrowLeft", "ArrowDown", "ArrowRight",
        "Numpad0", "NumpadDecimal"
    ]
]

interface KeyboardProps {
    style?: React.CSSProperties;
}

export default function Keyboard(props: KeyboardProps = {}) {

    const keyboard = useContext(KeyboardContext);
    const keyboardDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const coords: {x: number, y: number}[] = [];

        keyboard.forEach(keyEvent => {
            for (let i = 0; i < allKeys.length; i++) {
                const row = allKeys[i];
                const index = row.indexOf(keyEvent);
                if (index !== -1) {
                    coords.push({x: index, y: i});
                    break;
                }
            }
        })

        const keys = coords.map(({x, y}) => {
            const rows = Array.from(keyboardDiv.current?.querySelectorAll(':scope > div') || []);
            const targetRow = rows[y];
            const keysInRow = targetRow ? Array.from(targetRow.querySelectorAll(':scope > div')) : [];
            const key = keysInRow[x??0] as HTMLDivElement;

            key.classList.add(styles.keyPressed);

            return key;
        });

        const lastSelectedKeys = Array.from(keyboardDiv.current?.querySelectorAll(`.${styles.keyPressed}`) || []);
        const releasedKeys = lastSelectedKeys?.filter(x => !keys.includes(x as HTMLDivElement));

        if (releasedKeys) {
            releasedKeys.forEach(x => x.classList.remove(styles.keyPressed));
        }

    }, [keyboard]);


    return (
        <div className={styles.container} style={props.style}>
            <div className={styles.keyboard} ref={keyboardDiv}>

                <div>
                    <div />
                    <RepeatContent times={3}>
                        <Spacer />
                        <Keys amount={4} />
                    </RepeatContent>

                    <Spacer />
                    <Keys amount={3} />
                    
                </div>
                <Spacer />

                <div>
                    <Keys amount={13} />
                    <Keys width={50} />
                    <Spacer />
                    <Keys amount={3} />

                    <Spacer />
                    <Keys amount={4} />
                </div>

                <div>
                    <Keys width={40} />
                    <Keys amount={12} />
                    <Keys width={40} />
                    <Spacer />
                    <Keys amount={3} />

                    <Spacer />
                    <Keys amount={3} />
                    <Keys height={70} />
                </div>

                <div>
                    <Keys width={55} />
                    <Keys amount={11} />
                    <Keys width={65} />

                    <Spacer size={150} />
                    <Keys amount={3} />
                </div>

                <div>
                    <Keys width={75} />
                    <Keys amount={10} />
                    <Keys width={85} />
                    <Spacer size={50} />
                    <Keys amount={1} />

                    <Spacer size={50} />
                    <Keys amount={3} />
                    <Keys height={70} />
                </div>

                <div>
                    <Keys width={40} amount={3} />
                    <Keys width={220} />
                    <Keys width={40} amount={4} />
                    <Spacer />
                    <Keys amount={3} />

                    <Spacer />
                    <Keys width={70} />
                    <Keys />
                </div>
            </div>

            <div className={styles.armrest} />

            <div className={styles.table} />

        </div>
    )
}
