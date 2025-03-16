"use client";

import { useEffect, useRef } from "react";
import { type apps } from "../../utils/phone-setup/data";
import styles from "./AppItem.module.scss";
import { usePhoneContext } from "./context/PhoneContext";

interface AppItemProps {
  app: (typeof apps)[number];
}

export default function AppItem({ app }: AppItemProps) {
  const { setScreen } = usePhoneContext();

  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        new Image().src = `https://media.shadowaya.me/${app.icon}_ss.png`;
        observer.disconnect();
      }
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <div
      ref={elementRef}
      className={styles.item}
      style={{
        "--gradient-color": `#${app.hex}`,
      }}
    >
      <a href={app.link} target="_blank" rel="noopener noreferrer">
        <img
          src={`https://media.shadowaya.me/${app.icon}_icon.png`}
          alt={`${app.name} icon`}
          height={50}
          width={50}
          onMouseEnter={() => setScreen(app.icon)}
          onMouseLeave={() => setScreen(null)}
        />
        <span>{app.name}</span>{" "}
      </a>
      <p>{app.description}</p>
      <div className={styles.tags}>
        {app.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
