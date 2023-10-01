'use client';

import styles from './ComputerWindow.module.scss';
import { motion } from 'framer-motion';
import Iconify from '../../Iconify';

interface ComputerWindowProps {
    children?: React.ReactNode;
    title?: string;
    width?: number;
    height?: number;
    delay?: number;
    top?: number;
    left?: number;
}

export default function ComputerWindow({
    children,
    title = '',
    width = 200,
    height = 200,
    delay = 0,
    top = 0,
    left = 0,
}: ComputerWindowProps) {

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.8,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                delay,
                duration: 0.8,
                ease: 'easeInOut',
            }}
            className={styles.window}
            style={{
                height, width, top, left
            }}
        >
            <div>
                <p>
                    {title}
                </p>
                <div>
                    <Iconify width={20} icon="icon-park-outline:dot" />
                    <Iconify width={20} icon="icon-park-outline:dot" />
                    <Iconify width={20} icon="icon-park-outline:dot" />
                </div>
            </div>
            <div>
                {children}
            </div>
        </motion.div>
    )

}