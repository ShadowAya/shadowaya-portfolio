'use client';


import cn from 'classnames';
import styles from './Screens.module.scss';
import { shopCosts, useLethalValues } from './LethalValuesContext';
import ShopItem, { isEquipment } from './ShopItem';
import CreditIcon from './CreditIcon';
import Iconify from '../Iconify';


interface ScreenProps {

}

                        // isEquipment(item) ?
                        //     isNaN(values.sales[item]) ?
                        //         shopCosts[item]
                        //     : Math.round((shopCosts[item] - (shopCosts[item] * values.sales[item]/100)) * 10) / 10
                        // : shopCosts[item]

function notNaN(val: number) {
    return isNaN(val) ? 0 : val;
}

export function ScreenProfitQuota() {

    const rawValues = useLethalValues();
    const values = rawValues ? {
        ...rawValues,
        profitQuota: notNaN(rawValues.profitQuota),
        currentCredits: notNaN(rawValues.currentCredits),
        moonCost: notNaN(rawValues.moonCost),
        extraCustomItemsCost: notNaN(rawValues.extraCustomItemsCost),
    } : undefined;

    const itemCosts = values ?
        Object.entries(values.shopContents).reduce((acc, [item, val]) => (acc + (
            val * (
                isEquipment(item) ?
                    isNaN(values.sales[item]) ?
                        shopCosts[item]
                    : Math.round((shopCosts[item] - (shopCosts[item] * values.sales[item]/100)) * 10) / 10
                : shopCosts[item as keyof typeof shopCosts]
            )
        )), 0)
    : 0;
    const requiredSell = values ? (
        (75 + values.profitQuota + 5*(itemCosts + values.extraCustomItemsCost) - 5*values.currentCredits + 5*values.moonCost) / 6
    ) : 0;
    const normalizedRequiredSell =
            values ? (
            requiredSell < values.profitQuota ? values.profitQuota : Math.ceil(requiredSell)
        ) : 0
    ;

    return (
        <div className={styles.screen}><div><div>
            <p>PROFIT</p>
            <p>QUOTA:</p>
            {
                values &&
                <>
                    <div className={styles['with-icon']}>
                        <p>{
                            
                            (values.profitQuota + values.currentCredits) > (itemCosts + values.moonCost + values.extraCustomItemsCost) ?
                            values.profitQuota
                            : (
                                Math.max((requiredSell - values.profitQuota) / 5 - 15, 0) === 0 ? (itemCosts + values.moonCost + values.extraCustomItemsCost - values.currentCredits)
                                : normalizedRequiredSell
                            )

                        } /</p><Iconify icon="bx:calculator" height={30} opacity={0.5} />
                    </div>
                    <div className={styles['with-icon']}>
                        <input
                            value={rawValues!.profitQuota}
                            type="number"
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (val < 0 || val > 99999) return;
                                values.setParams({ profitQuota: val })
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") values.setParams({ profitQuota: 0 })
                            }}
                        />
                        <Iconify icon="material-symbols:edit-outline" height={30} opacity={0.5} />
                    </div>
                </>
            }
        </div></div></div>
    )

}

export function ScreenCredits() {

    const values = useLethalValues();

    return (
        <div className={styles.screen}><div><div>
            <p>CREDITS:</p>
            {
                values &&
                <>
                    <div className={styles['with-icon']}>
                        <span className={styles['with-credits']}><CreditIcon /><input
                            value={values.currentCredits}
                            type="number"
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (val < 0 || val > 99999) return;
                                values.setParams({ currentCredits: val })
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") values.setParams({ currentCredits: 0 })
                            }}
                        /></span>
                        <Iconify icon="material-symbols:edit-outline" height={30} opacity={0.5} />
                    </div>
                    <span className={styles['small-text']}>Input before selling!</span>
                </>
            }
        </div></div></div>
    )

}

export function ScreenShopValue() {

    const values = useLethalValues();
    const cost = values ? (
        Object.entries(values.shopContents).reduce((acc, [item, val]) => (acc + (
            val * (
                    isEquipment(item) ?
                    isNaN(values.sales[item]) ?
                        shopCosts[item]
                    : Math.round((shopCosts[item] - (shopCosts[item] * values.sales[item]/100)) * 10) / 10
                : shopCosts[item as keyof typeof shopCosts]
            )
        )), 0) + (isNaN(values.extraCustomItemsCost) ? 0 : values.extraCustomItemsCost)
    ) : 0;

    return (
        <div className={styles.screen}><div><div>
            <p>PURCHASE</p>
            <p>COST:</p>
            <div className={styles['with-icon']}>
                <span className={styles['with-credits']}><CreditIcon />{Math.ceil(cost)}</span>
                <Iconify icon="bx:calculator" height={30} opacity={0.5} />
            </div>
        </div></div></div>
    )

}

export function ScreenMoon() {

    const values = useLethalValues();

    return (
        <div className={styles.screen}><div><div>
            <p>MOON</p>
            <p>COST:</p>
            {
                values &&
                <div className={styles['with-icon']}>
                    <span className={styles['with-credits']}><CreditIcon /><input
                        value={values.moonCost}
                        type="number"
                        onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (val < 0 || val > 99999) return;
                            values.setParams({ moonCost: val })
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") values.setParams({ moonCost: 0 })
                        }}
                    /></span>
                    <Iconify icon="material-symbols:edit-outline" height={30} opacity={0.5} />
                </div>
            }
        </div></div></div>
    )

}

export function ScreenShop() {

    const values = useLethalValues();

    return (
        <div className={cn(
            styles.screen,
            styles['larger-screen']
        )}><div><div>
            
            { values && <span className={styles.title}>Equipment</span>}
            <div className={styles['shop-stack']}>
                {
                    values &&
                    Object.keys(values.shopContents).map((key) => (
                        <ShopItem key={key} item={key as keyof typeof values.shopContents} />
                    ))
                }
                {
                    values && 
                    <span className={styles['extra-costs']}>
                        <span>Extra Item Costs & Reserve //</span>
                        <input
                            value={values.extraCustomItemsCost}
                            type="number"
                            onChange={(e) => values.setParams({ extraCustomItemsCost: parseInt(e.target.value) })}
                        />
                    </span>
                }
            </div>

        </div></div></div>
    )

}