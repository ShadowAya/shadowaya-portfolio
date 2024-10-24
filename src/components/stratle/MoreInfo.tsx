'use client';

import { useEffect, useState } from 'react';
import Iconify from '../Iconify';
import styles from './MoreInfo.module.scss';
import cn from 'classnames';

export default function MoreInfo() {

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

    const [showInfo, setShowInfo] = useState(false);
  
    useEffect(() => {
        function handleFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement) {
                setIsBrowserFullscreen(false);
            }
        }
  
        function handleBrowserFullscreenChange() {
            const isWindowFullscreen = window.innerWidth === screen.width && window.innerHeight === screen.height;
            const isExitingBrowserFullscreen = isBrowserFullscreen && !isWindowFullscreen;
    
            if (!document.fullscreenElement && isWindowFullscreen) {
                setIsBrowserFullscreen(true);
            }
    
            if (isExitingBrowserFullscreen) {
                setIsBrowserFullscreen(false);
            }
        }
    
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('resize', handleBrowserFullscreenChange);
    
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('resize', handleBrowserFullscreenChange);
        };
    }, [isBrowserFullscreen]);
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }


    return <div className={styles.more}>
        {!isBrowserFullscreen &&
            <button onClick={() => toggleFullscreen()}>
                <Iconify icon={isFullscreen ? "mingcute:fullscreen-exit-fill" : "mingcute:fullscreen-fill"} height={24} />
            </button>
        }
        <button className={styles.info} onClick={() => setShowInfo(v => !v)}>
            <Iconify icon="material-symbols:info" height={24} />
            <div className={cn(showInfo && styles.show)}>
                <div>
                    <h4></h4>
                    <span>
                        Daily stratagems rotate on UTC+0 midnight
                    </span>
                </div>
                <div>
                    <h4>Credit</h4>
                    <span>
                        <a target='_blank' href={"https://helldivers.wiki.gg/"}>helldivers.wiki.gg</a> - Stratagem Data <br />
                        <a target='_blank' href={"https://www.arrowheadgamestudios.com/"}>Arrowhead Game Studios</a> - HELLDIVERS 2 Developer
                    </span>
                </div>
                <div>
                    <h4>Author</h4>
                    <span>
                        <a target='_blank' href={"https://www.shadowaya.me/"}>
                            shadow_aya
                        </a>
                    </span>
                </div>
            </div>
        </button>
    </div>

}