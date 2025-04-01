"use client";

import { useState, useEffect } from "react";
import { SettingsKeys, useStratagems } from "./context/StratagemsContext";
import styles from "./Settings.module.scss";
import cn from "classnames";

export default function Settings() {
  const { settings, updateSettings, setSettingsRecording } = useStratagems();
  const [recording, setRecording] = useState<SettingsKeys | null>(null);

  const formatKey = (key: string) => {
    if (key === " ") {
      return "Spacebar";
    }
    if (key.length === 1) {
      return key.toUpperCase();
    }
    return key;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!recording) {
        return;
      }
      const key = e.key;

      if (key === "Backspace") {
        return;
      }

      if (key === "Escape") {
        setRecording(null);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      updateSettings(recording, key);
      setRecording(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [recording, settings, updateSettings]);

  useEffect(() => {
    setSettingsRecording(!!recording);
  }, [recording]);

  const startRecording = (key: SettingsKeys) => {
    setRecording(key);
  };

  return (
    <div>
      <h4>Settings</h4>
      <div className={styles.settings}>
        <h5>Controls</h5>
        <div className={styles.setting}>
          <span>Arrow Up</span>
          <span
            className={cn(recording === "controls.up" && styles.recording)}
            onClick={() => startRecording("controls.up")}
          >
            {formatKey(settings.controls.up)}
          </span>
        </div>
        <div className={styles.setting}>
          <span>Arrow Down</span>
          <span
            className={cn(recording === "controls.down" && styles.recording)}
            onClick={() => startRecording("controls.down")}
          >
            {formatKey(settings.controls.down)}
          </span>
        </div>
        <div className={styles.setting}>
          <span>Arrow Left</span>
          <span
            className={cn(recording === "controls.left" && styles.recording)}
            onClick={() => startRecording("controls.left")}
          >
            {formatKey(settings.controls.left)}
          </span>
        </div>
        <div className={styles.setting}>
          <span>Arrow Right</span>
          <span
            className={cn(recording === "controls.right" && styles.recording)}
            onClick={() => startRecording("controls.right")}
          >
            {formatKey(settings.controls.right)}
          </span>
        </div>
      </div>
    </div>
  );
}
