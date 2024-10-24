import { getStratagemList } from "@/utils/stratle/actions";
import styles from './RootLayout.module.scss';
import Image from "next/image";
import Dashed from "@/components/stratle/Dashed";
import Box from "@/components/stratle/Box";
import Nav from "@/components/stratle/Nav";
import { StratagemProvider } from "./context/StratagemsContext";
import { GameProvider } from "./context/GameContext";

interface LayoutProps {
    children?: React.ReactNode;
}

function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return hash >>> 0;
}
  
function getRandomIndexByDate(length: number) {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date (yyyy-mm-dd)
    const hash = hashString(currentDate);
    
    // Pick an item using the hash value
    return hash % length;
}

export default async function RootLayout({ children }: LayoutProps) {

    const content = await getStratagemList();
    const index = getRandomIndexByDate(content.length);

    return <section className={styles.page}>
        <StratagemProvider stratagems={content} todayIndex={index}>
        <GameProvider>
        <Image
            src={'/hd2-bg.png'}
            width={1920}
            height={1080}
            alt={'background'}
        />
        <div>
            <div className={styles.title}>
                <Box className={styles.logo}>
                    <Dashed
                        absolute={'8px'}
                    />
                    <Image
                        src={'/hd2-logo.png'}
                        width={30}
                        height={30}
                        alt={'logo'}
                    />
                </Box>
                <div className={styles.texts}>
                    <h1>STRATLE</h1>
                    <h2>A WORDLE GAME FOR HELLDIVERS 2 STRATAGEMS</h2>
                </div>
            </div>
            <Nav />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    </GameProvider></StratagemProvider></section>

}