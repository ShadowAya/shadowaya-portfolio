'use client';

import Iconify from "../Iconify";
import CreditIcon from "./CreditIcon";
import { useLethalValues, shopCosts } from "./LethalValuesContext";
import styles from './ShopItem.module.scss';

interface ShopItemProps {
    item: keyof typeof shopCosts;
}

const equipment = [
    "Boombox",
    "Extension Ladder",
    "Flashlight",
    "Jetpack",
    "Lockpicker",
    "Pro-Flashlight",
    "Radar-Booster",
    "Shovel",
    "Spray Paint",
    "Stun Grenade",
    "TZP-Inhalant",
    "Walkie-Talkie",
    "Zap Gun"
] as const;

export function isEquipment(item: string): item is typeof equipment[number] {
    return equipment.includes(item as any);
}

export default function ShopItem({ item }: ShopItemProps) {

    const values = useLethalValues();

    return (
        <div className={styles.item}>
            <span>* {item} {"//"}</span>
            {   
                values &&
                <div>
                    {
                        isEquipment(item) &&
                        <span className={styles.sales}>{"(-"}
                            <input
                                className={styles['sales-input']}
                                value={values.sales[item]}
                                type="number"
                                onChange={(e) => {
                                    let val = parseInt(e.target.value);
                                    if (val < 0 || val > 100) return;
                                    values.setSale(item, val)
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "") values.setSale(item, 0)
                                }}
                            />
                        {"%)"}</span>
                    }
                    <span className={styles.cost}><CreditIcon height={7} />{
                        isEquipment(item) ?
                            isNaN(values.sales[item]) ?
                                shopCosts[item]
                            : Math.round((shopCosts[item] - (shopCosts[item] * values.sales[item]/100)) * 10) / 10
                        : shopCosts[item]
                    }</span>
                    <Iconify icon="ic:baseline-minus" height={25}
                        onClick={() => {

                            if (values.shopContents[item] === 0) return;
                            values.setShopItem({
                                item,
                                amount: values.shopContents[item] - 1
                            })

                        }}
                    />
                    <span className={styles.amount}>{values.shopContents[item]}</span>
                    <Iconify icon="ic:baseline-plus" height={25}
                        onClick={() => {

                            if (
                                !isEquipment(item) &&
                                values.shopContents[item] === 1
                            ) return;

                            if (values.shopContents[item] > 29 ) return;

                            values.setShopItem({
                                item,
                                amount: values.shopContents[item] + 1
                            })

                        }}
                    />
                </div>
            }
        </div>
    )

}