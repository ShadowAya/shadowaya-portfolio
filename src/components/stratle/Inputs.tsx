"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Inputs.module.scss";
import { useGame } from "./context/GameContext";
import { useStratagems } from "./context/StratagemsContext";
import Box from "./Box";
import Dashed from "./Dashed";
import Image from "next/image";
import Dialog from "./Dialog";
import cn from "classnames";
import TouchControls from "./TouchControls";

export default function Inputs() {
  const {
    settings: { controls },
    settingsRecording,
    ...stratagemMeta
  } = useStratagems();
  const gameMeta = useGame();

  const game = gameMeta[gameMeta.currentGame];
  const stratagem =
    stratagemMeta.stratagems[
      gameMeta.currentGame === "endless"
        ? stratagemMeta.randomIndex
        : stratagemMeta.todayIndex
    ];

  const [currentInputs, setCurrentInputs] = useState<
    ("up" | "right" | "down" | "left")[]
  >([]);
  const currentInputsRef = useRef(currentInputs);

  const difficultyMultiplier = [0, 1, 2, 2, 3][game.difficulty - 1];
  const hideArmed = game.difficulty > 3;

  const otherGame =
    gameMeta[gameMeta.currentGame === "daily" ? "endless" : "daily"];
  const hideArmedOtherGamemode =
    otherGame.difficulty >= 4 &&
    otherGame.inputs.length > 0 &&
    !(otherGame.didWin || otherGame.didLose);

  // const [armedStratagems, setArmedStratagems] = useState<Stratagem[]>(stratagemMeta.stratagems);
  // const [highlightedArrows, setHighlightedArrows] = useState<number>(0);

  // useEffect(() => {
  //     const handler = setTimeout(() => {
  //         const filteredStratagems = armedStratagems.filter(stratagem => {
  //             return stratagem.code.join('').startsWith(currentInputs.join(''));
  //         });
  //         setHighlightedArrows(currentInputs.length);
  //         setArmedStratagems(filteredStratagems);
  //     }, 200);

  //     return () => {
  //         clearTimeout(handler);
  //     };
  // }, [currentInputs, stratagemMeta.stratagems]);

  const [precomputedStratagems, setPrecomputedStratagems] = useState(() => {
    return stratagemMeta.stratagems.map((s) => ({
      ...s,
      codeString: s.code.join(""),
    }));
  });

  const armedStratagems = useMemo(() => {
    return precomputedStratagems.filter((stratagem) =>
      stratagem.codeString.startsWith(currentInputs.join(""))
    );
  }, [currentInputs, precomputedStratagems]);

  useEffect(() => {
    if (
      armedStratagems.length !== 1 ||
      armedStratagems[0].code.length !== currentInputs.length
    )
      return;

    if (stratagem.code.join("") === currentInputs.join("")) {
      // game won
      game.won();
    } else if (game.inputs.length > 4 - difficultyMultiplier) {
      // game lost
      game.lost();
    }

    game.addInput(currentInputs);
    // setArmedStratagems(stratagemMeta.stratagems);
    setCurrentInputs([]);
  }, [armedStratagems]);

  function arrowPress(e: KeyboardEvent) {
    const inputs = currentInputsRef.current;

    if (inputs.length >= 8) return;
    if (settingsRecording) return;

    switch (e.key) {
      case controls.up:
        setCurrentInputs((v) => [...v, "up"]);
        break;
      case controls.right:
        setCurrentInputs((v) => [...v, "right"]);
        break;
      case controls.down:
        setCurrentInputs((v) => [...v, "down"]);
        break;
      case controls.left:
        setCurrentInputs((v) => [...v, "left"]);
        break;
      case "Backspace":
        setCurrentInputs((v) => v.slice(0, -1));
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", arrowPress);

    return () => {
      window.removeEventListener("keydown", arrowPress);
    };
  }, [controls, settingsRecording]);

  useEffect(() => {
    currentInputsRef.current = currentInputs;
  }, [currentInputs]);

  function mapArrows(
    arrows: ("up" | "right" | "down" | "left")[]
  ): ArrowListProps["arrows"] {
    const counts = {
      up: 0,
      right: 0,
      down: 0,
      left: 0,
    };

    stratagem.code.forEach((arrow) => {
      counts[arrow]++;
    });

    return arrows.map((arrow, i) => {
      const ret: ArrowListProps["arrows"][0] = {
        direction: arrow,
        col:
          stratagem.code[i] === arrow
            ? "green"
            : stratagem.code.includes(arrow) && counts[arrow] > 0
            ? "yellow"
            : "red",
      };

      counts[arrow]--;

      return ret;
    });
  }

  return (
    <div className={styles.inputs}>
      <Dialog />
      <div className={styles.arrowcontainer}>
        {game.inputs.map((arrows, i) => (
          <ArrowList key={i} arrows={mapArrows(arrows)} />
        ))}
        {!(game.didLose || game.didWin) && (
          <ArrowList
            resetFn={() => {
              setCurrentInputs([]);
              // setArmedStratagems(stratagemMeta.stratagems);
              // setHighlightedArrows(0);
            }}
            arrows={currentInputs.map((a) => ({ direction: a, col: "none" }))}
          />
        )}
      </div>
      <div className={styles.controls}>
        <TouchControls setInput={setCurrentInputs} />
        <div className={styles.heading}>
          <div />
          <span>ARMING</span>
          <div />
        </div>
        <Box
          hideTop
          className={cn(
            styles.stratagemlist,
            (hideArmed || hideArmedOtherGamemode) && styles.hidden
          )}
        >
          <div className={styles.armedhidden}>
            <Dashed absolute="15px" />
            <span>
              <span>{armedStratagems.length}</span> Stratagems Armed
            </span>
            {!hideArmed && hideArmedOtherGamemode && (
              <span className={styles.othergameblock}>
                {"Your running high difficulty "}
                {gameMeta.currentGame === "daily" ? "endless" : "daily"}
                {" game is blocking the list"}
              </span>
            )}
            <span className={styles.treasondisclaimer}>
              Checking a list of stratagems and not using your memory from the
              battlefield will be considered treason
            </span>
          </div>
          {armedStratagems.map((stratagem, i) => (
            <div key={i} className={styles.stratagemitem}>
              <div>
                {stratagem.icon ? (
                  <Image
                    src={"https://helldivers.wiki.gg/" + stratagem.icon}
                    width={30}
                    height={30}
                    alt={"icon"}
                  />
                ) : (
                  <Dashed height="30px" width="30px" small />
                )}
              </div>
              <div>
                <span>{stratagem.name}</span>
                <div>
                  {stratagem.code.map((arrow, i) => (
                    <Image
                      style={{
                        opacity: i < currentInputs.length ? 1 : 0.4,
                      }}
                      key={i}
                      src={`/hd2arrows/${arrow}.png`}
                      width={16}
                      height={16}
                      alt={arrow}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Box>
      </div>
      <div></div>
    </div>
  );
}

interface ArrowListProps {
  arrows: {
    direction: "up" | "down" | "left" | "right";
    col: "none" | "red" | "green" | "yellow";
  }[];
  resetFn?: () => void;
  inputFn?: () => void;
}

function ArrowList({ arrows, resetFn }: ArrowListProps) {
  return (
    <div className={styles.arrowlist}>
      {arrows.map((arrow, i) => (
        <div key={i} className={styles[arrow.col]}>
          <Image
            src={`/hd2arrows/${arrow.direction}.png`}
            width={32}
            height={32}
            alt={arrow.direction}
          />
        </div>
      ))}
      {new Array(8 - arrows.length).fill(0).map((_, i) => (
        <div key={i} />
      ))}
      {resetFn ? (
        <button className={styles.reset} onClick={resetFn}>
          <Dashed absolute="4px" />
          <span>Reset Input</span>
        </button>
      ) : (
        <button className={styles.noreset} disabled>
          <span>Reset Input</span>
        </button>
      )}
    </div>
  );
}
