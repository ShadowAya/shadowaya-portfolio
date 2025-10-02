import styles from "./RootLayout.module.scss";
import Image from "next/image";
import Dashed from "@/components/stratle/Dashed";
import Box from "@/components/stratle/Box";
import Nav from "@/components/stratle/Nav";
import { StratagemProvider } from "./context/StratagemsContext";
import { GameProvider } from "./context/GameContext";
import TreasonWarning from "./TreasonWarning";
import MoreInfo from "./MoreInfo";
import moment from "moment-timezone";
import PageWrap from "./PageWrap";
import { getStratagemList } from "@/utils/stratle/utils";
import { unstable_cacheLife as cacheLife } from "next/cache";

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

async function getRandomIndexByDate(length: number) {
    "use cache";
    cacheLife({
        stale: 60 * 60 * 1, // 1h - faster stale time for better performance
        revalidate: 60 * 60 * 24, // 1d
        expire: 60 * 60 * 48, // 2d
    });
    const currentDate = moment().tz("UTC").format("YYYYMMDD");
    const hash = hashString(currentDate);

    return hash % length;
}

export default async function RootLayout({ children }: LayoutProps) {
    "use cache";
    const content = await getStratagemList();
    console.log(content.find(v => v.name === "Hellbomb"));
    const index = await getRandomIndexByDate(content.length);

    return (
        <div className={styles.layout}>
            <Image
                src={"/hd2-bg.png"}
                width={1920}
                height={1080}
                alt={"background"}
            />
            <StratagemProvider stratagems={content} todayIndex={index}>
                <GameProvider>
                    <PageWrap>
                        <div>
                            <div className={styles.title}>
                                <Box className={styles.logo}>
                                    <Dashed absolute={"8px"} />
                                    <Image
                                        src={"/hd2-logo.png"}
                                        width={30}
                                        height={30}
                                        alt={"logo"}
                                    />
                                </Box>
                                <div className={styles.texts}>
                                    <h1>STRATLE</h1>
                                    <h2>
                                        A WORDLE GAME FOR HELLDIVERS 2
                                        STRATAGEMS
                                    </h2>
                                </div>
                            </div>
                            <Nav />
                            <div className={styles.content}>{children}</div>
                        </div>
                    </PageWrap>
                    <TreasonWarning />
                    <MoreInfo />
                </GameProvider>
            </StratagemProvider>
        </div>
    );
}
