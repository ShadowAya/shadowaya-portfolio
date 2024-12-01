import PercentageText from "@/components/PercentageText";
import styles from "./page.module.scss";
import { Noto_Sans } from "next/font/google";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

const font = Noto_Sans({
    subsets: ["latin"],
    weight: ["300"],
});

export default function NotFound() {
    return (
        <div className={cn(styles.notfound, font.className)}>
            <h1>:(</h1>
            <p>
                Your PC ran into a nonexistent page and needs to go back.
                We&apos;re doing nothing about this, please navigate away.
            </p>
            <PercentageText />
            <div>
                <Image src="/qr.png" alt="qr code" width={100} height={100} />
                <p>
                    <span>
                        For more information about this issue and possible
                        fixes, visit{" "}
                        <Link href="/" scroll={false}>
                            https://www.shadowaya.me/
                        </Link>
                    </span>
                    <span>
                        If you call a support person, give them this info:
                    </span>
                    <span>Stop code: HOW_DID_I_GET_HERE</span>
                </p>
            </div>
        </div>
    );
}
