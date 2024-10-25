'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './RootLayout.module.scss';

interface LayoutProps {
    children?: React.ReactNode;
}

export default function PageWrap({ children }: LayoutProps) {

    const section = useRef<HTMLDivElement>(null);
    const [scaleFactor, setScaleFactor] = useState(100);
    // const maxScroll = useRef(850);
    const sizingBox = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const parent = section.current?.parentElement as HTMLDivElement;

        function scaleDown() {
            const scaleFactorValue = (parent.clientWidth / parent.scrollWidth) * 100;

            if (parent.scrollWidth > parent.clientWidth) {
                setScaleFactor(scaleFactorValue);
                const parentStyles = window.getComputedStyle(parent);
                // maxScroll.current = (850 / 100 * scaleFactorValue) - parent.clientHeight;
            } else {
                setScaleFactor(100);
                // maxScroll.current = 850;
            }
        }

        window.addEventListener('resize', scaleDown);

        scaleDown();

        return () => {
            window.removeEventListener('resize', scaleDown);
        }

    }, []);

    // useEffect(() => {
    //     // adjust parent's scroll height
    //     const parent = section.current?.parentElement as HTMLDivElement;
    //     if (parent && section.current) {
    //         // Calculate the scaled height of the content
    //         const scaledContentHeight = section.current.offsetHeight * (scaleFactor / 100); 
        
    //         // Set the parent's height to accommodate the scaled content
    //         parent.style.height = `${scaledContentHeight}px`; 
    //     }
    // }, [scaleFactor]);

    useEffect(() => {

        const box = sizingBox.current as HTMLDivElement;
        const sectionBox = section.current as HTMLDivElement;

        const sectionStyles = window.getComputedStyle(sectionBox);

        const sectionBoxHeight =
            parseFloat(sectionStyles.height) +
            parseFloat(sectionStyles.paddingTop) +
            parseFloat(sectionStyles.paddingBottom);

        box.style.height = (sectionBoxHeight / 100 * scaleFactor) + 'px';
        // box.style.maxHeight = (sectionBoxHeight / 100 * scaleFactor) + 'px';

    }, [scaleFactor]);

    return <div
        ref={sizingBox}
        className={styles.wrap}
    ><section
        ref={section}
        className={styles.page}
        style={{
            transform: `scale(${scaleFactor / 100})`,
            transformOrigin: '0 0',
        }}
    >{children}</section></div>

}