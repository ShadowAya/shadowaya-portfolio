/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { usePhoneContext } from "./context/PhoneContext";
import styles from "./PhoneScreen.module.scss";
import cn from "classnames";

export default function PhoneScreen() {
  const phone = usePhoneContext();
  const prevImage = phone.previousScreen;
  const image = phone.screen;

  const imageOut = prevImage === "niagara_launcher" ? null : prevImage;
  const imageIn = image === "niagara_launcher" ? null : image;

  const [flipAnimation, setFlipAnimation] = useState<boolean | null>(null);

  useEffect(() => {
    if (flipAnimation === null && phone.isFlipped === false) return;
    if (flipAnimation === phone.isFlipped) return;

    setFlipAnimation(phone.isFlipped);
  }, [phone.isFlipped]);

  return (
    <div
      className={cn(
        styles.container,
        flipAnimation === true && styles.flip,
        flipAnimation === false && styles.unflip
      )}
    >
      {imageIn && (
        <img
          src={`https://media.shadowaya.me/${imageIn}_ss.png`}
          alt="Phone screen"
          className={styles.imageIn}
        />
      )}
      {imageOut && (
        <img
          src={`https://media.shadowaya.me/${imageOut}_ss.png`}
          alt="Phone screen"
          className={styles.imageOut}
        />
      )}
      <img
        src={
          image === "niagara_launcher"
            ? `https://media.shadowaya.me/niagara_launcher_ss.png`
            : `/homescreen.png`
        }
        alt="Phone screen"
        className={styles.imageBg}
      />
      <img src="/phoneback.png" alt="Phone back" className={styles.back} />
    </div>
  );
}
