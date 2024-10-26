'use client';

import { useEffect, useRef, useState } from 'react';
import Iconify from '../Iconify';
import styles from './MoreInfo.module.scss';
import cn from 'classnames';

export default function MoreInfo() {

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
    const isBrowserFullscreenRef = useRef(false);
    // const [isVertical, setIsVertical] = useState(false);

    const [showInfo, setShowInfo] = useState(false);

    const [isStandalone, setIsStandalone] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()

            const { outcome } = await deferredPrompt.userChoice

            if (outcome === 'accepted') {
                setIsStandalone(true);
            }

            setDeferredPrompt(null)
        }
    }
  
    useEffect(() => {

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        }
    
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        function handleFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement) {
                setIsBrowserFullscreen(false);
            }
        }
  
        function handleBrowserFullscreenChange() {
            const isWindowFullscreen = window.innerWidth === screen.width && window.innerHeight === screen.height;
            const isExitingBrowserFullscreen = isBrowserFullscreenRef && !isWindowFullscreen;
    
            if (!document.fullscreenElement && isWindowFullscreen) {
                setIsBrowserFullscreen(true);
            }
    
            if (isExitingBrowserFullscreen) {
                setIsBrowserFullscreen(false);
            }

            // setIsVertical(window.innerHeight > window.innerWidth);
        }
    
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('resize', handleBrowserFullscreenChange);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // setIsVertical(window.innerHeight > window.innerWidth);
    
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('resize', handleBrowserFullscreenChange);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    useEffect(() => {
        isBrowserFullscreenRef.current = isBrowserFullscreen;
    }, [isBrowserFullscreen]);
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }


    return <div className={styles.more}>
        {/* { isVertical ?
            <div className={styles.left}>
                <Iconify icon="dashicons:image-rotate-right" height={24} />
                <span>Go horizontal!</span>
            </div> : <div />
        } */}
        <div className={styles.right}>
            {!isStandalone && <InstallPrompt
                canActivate={deferredPrompt !== null}
                handleInstallClick={handleInstallClick}
            />}
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
                        <h4></h4>
                        <span>
                            This website is primarily designed for desktop use
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
    </div>

}

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
    canActivate?: boolean;
    handleInstallClick: () => void;
}

function InstallPrompt({ canActivate, handleInstallClick }: InstallPromptProps) {
    const [manualInstallString, setManualInstallString] = useState<string>("Install this app inside your browser's menu");

    const [showManualInstall, setShowManualInstall] = useState(false);

    function handleManualInstallClick() {
        setShowManualInstall(v => !v);
    }
   
    useEffect(() => {

        if (
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        ) {
            setManualInstallString("Tap the share button and select 'Add to Home Screen'");
        } else if (
            /Android/.test(navigator.userAgent)
        ) {
            setManualInstallString("Tap the menu button and select 'Install' or 'Add to Home Screen > Install'");
        } else if (
            /Chrome/.test(navigator.userAgent)
        ) {
            setManualInstallString("Tap the install button near the address bar");
        } else if (
            /Firefox/.test(navigator.userAgent)
        ) {
            setManualInstallString("Install this app via a Firefox PWA extension");
        }
    
    }, []);
   
    return (
      <button className={styles.install} onClick={canActivate ? handleInstallClick : handleManualInstallClick}>
            <Iconify icon="material-symbols:download" height={24} />
            <span>Install App</span>
            { showManualInstall && !canActivate &&
                <span className={styles.installinfo}>
                    <span>{manualInstallString}</span>
                    <span>
                        <a target='_blank' href={"https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing"}>More Info</a>
                    </span>
                </span>
            }
      </button>
    )
  }