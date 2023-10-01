'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardContext } from './context/KeyboardContext';
import { DeviceContext } from './context/DeviceContext';

interface GlobalEffectsProps {
    children: React.ReactNode;
}

const SPEED = 2;
const LIMIT_X = 40;
const LIMIT_Y = 20;

export default function GlobalEffects({ children }: GlobalEffectsProps) {
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 1, y: 1 });
    const bodyMain = useRef<HTMLElement | null>(null);

    const [extraRotation, setExtraRotation] = useState<{ x: number, y: number }>({ x: 0, y: 0});

    const doubleSpeed = useRef<boolean>(false);

    const activeRotationKeys = useRef<{
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }>({
        up: false,
        down: false,
        left: false,
        right: false,
    });

    const keyboard = useContext(KeyboardContext);

    const device = useContext(DeviceContext);
    const hasPointerDevice = device?.hasPointer;

    const handleMouseMove = (e: MouseEvent) => {
        const x = 1 - (e.clientX / window.innerWidth);
        const y = 1 - (e.clientY / window.innerHeight);

        setMousePosition({ x, y });
    };

    useEffect(() => {
        bodyMain.current = window.document.querySelector('body main');
    }, []);

    useEffect(() => {

        const interval = setInterval(() => {

            setExtraRotation(({x, y}) => {
                    
                const {up, down, left, right} = activeRotationKeys.current;
                
                let realSpeed = doubleSpeed.current ? SPEED * 4 : SPEED;

                const newX = x + (left ? -realSpeed : 0) + (right ? realSpeed : 0);
                const newY = y + (up ? realSpeed : 0) + (down ? -realSpeed : 0);

                return {
                    x: newX < LIMIT_X && newX > -LIMIT_X ? newX : x,
                    y: newY < LIMIT_Y && newY > -LIMIT_Y ? newY : y,
                };

            });

        }, 100);

        if (hasPointerDevice) window.addEventListener('mousemove', handleMouseMove);
        else window.removeEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
        };
    }, [hasPointerDevice]);

    useEffect(() => {

        activeRotationKeys.current.left = keyboard.has('KeyA');
        activeRotationKeys.current.right = keyboard.has('KeyD');
        activeRotationKeys.current.up = keyboard.has('KeyW');
        activeRotationKeys.current.down = keyboard.has('KeyS');

        doubleSpeed.current = keyboard.has('ShiftLeft');

    }, [keyboard]);

    useEffect(() => {

        let rotationX = -mousePosition.x*4 - 7;
        let rotationY = mousePosition.y*4 - 17;

        if (bodyMain) {
            bodyMain?.current?.animate([
                {transform: `rotateX(${rotationY + extraRotation.y}deg) rotateY(${rotationX + extraRotation.x}deg)`},
            ], {
                duration: 100,
                easing: 'ease-out',
                fill: 'forwards',
            });
            /* bodyMain.style.transform =
                `rotateX(${rotationY + extraRotation.y}deg) rotateY(${rotationX + extraRotation.x}deg)`; */
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mousePosition, extraRotation]);

    return children;
}
