import { ScreenCredits, ScreenMoon, ScreenProfitQuota, ScreenShop, ScreenShopValue } from "@/components/lethal-calculator/Screens";
import styles from './page.module.scss';

export default function LethalCalculatorPage() {

    return (<>

        <div className={styles.monitors}>
            <div>
                <ScreenProfitQuota />
                <ScreenCredits />
            </div>
            <div>
                <ScreenShopValue />
                <ScreenMoon />
            </div>
        </div>
        <div className={styles.shop}>
            <ScreenShop />
        </div>

    </>)

}