import libxmljs from "libxmljs";
import { unstable_cacheLife as cacheLife } from "next/cache";

export type Stratagem = {
  name: string;
  icon: string | null;
  permitType: string;
  unlockLevel: string;
  unlockCost: string;
  module: string;
  traits: string[];
  code: ("up" | "right" | "left" | "down")[];
  cooldown: number;
  uses: number;
};

function parseArrow(arrowImg: string) {
  if (arrowImg.includes("Up_Arrow")) return "up";
  if (arrowImg.includes("Right_Arrow")) return "right";
  if (arrowImg.includes("Down_Arrow")) return "down";
  if (arrowImg.includes("Left_Arrow")) return "left";
  return "up";
}

export async function getStratagemList() {
  "use cache";
  cacheLife({
    stale: 60 * 60 * 1, // 1 hour
    revalidate: 60 * 60 * 24, // 24 hours
    expire: 60 * 60 * 25, // 25 hours
  });

  console.log("Fetching stratagems...");
  const stratagems: Stratagem[] = [];

  const res = await fetch("https://helldivers.wiki.gg/wiki/Stratagems", {
    cache: "no-store",
  });
  const html = await res.text();
  // const html = fs.readFileSync('./content.txt', 'utf8');

  const doc = await libxmljs.parseHtmlAsync(html);

  const stratagemLinks = doc
    .find("//table[contains(@class, 'wikitable')][1]/tbody/tr/td[2]/a/@href")
    .map(
      (a) =>
        ("https://helldivers.wiki.gg" +
          (a.child(0)?.text() ?? "")) as `https://helldivers.wiki.gg${string}`
    );

  for (const link of stratagemLinks) {
    const res = await fetch(link, { cache: "no-store" });
    const html = await res.text();
    // const html = fs.readFileSync('./content2.txt');

    const doc = libxmljs.parseHtml(html);
    const table = doc.find(
      "//aside[contains(@class, 'portable-infobox')][1]"
    )[0];
    const icon =
      doc
        .find(
          "//aside[contains(@class, 'portable-infobox')][1]//img[@class='pi-image-thumbnail']/@src"
        )[0]
        .child(0)
        ?.text() ?? null;
    const content = table.find(".//div[contains(@class, 'pi-data-value')]");

    const statsTable = doc
      .find("//table[contains(@class, 'wikitable')]/tbody")[0]
      .childNodes()
      .map((e) => e.text());

    let usesString = statsTable.find((a) => a.startsWith("\nUses")) ?? "";
    usesString =
      (usesString.includes("Standard")
        ? /^(.|\n)+Standard(\n)+(?<res>.+)(\n)+$/g.exec(usesString)?.groups?.res
        : /^(.|\n)+Uses(\n)+(?<res>.+)(\n)+$/g.exec(usesString)?.groups?.res) ??
      "Unlimited";
    const uses =
      usesString === "Unlimited"
        ? 0
        : parseInt(usesString.replace(" seconds", ""));

    let cooldownString =
      statsTable.find((a) => a.startsWith("\nCooldown")) ?? "";
    cooldownString =
      /^(.|\n)+Standard(\n)+(?<res>.+)(\n)+$/g.exec(cooldownString)?.groups
        ?.res ?? "Unlimited";
    const cooldown =
      cooldownString === "Unlimited"
        ? 0
        : parseInt(cooldownString.replace(" seconds", ""));

    const entry = (
      content.length == 6
        ? {
            permitType: content[0].child(0)?.text(),
            unlockLevel: content[1].child(0)?.text(),
            unlockCost: content[2].child(0)?.text(),
            module: content[3].child(0)?.text(),
            traits: content[4]
              .child(0)
              ?.text()
              .split(/ ? ?• ? ?/),
            code: content[5].find(".//img/@src").map((a) =>
              parseArrow(
                a
                  .toString()
                  .replace(/^\s+src="/, "")
                  .replace(/"$/, "")
              )
            ),
          }
        : content[1].child(0)?.text() == "?"
        ? {
            permitType: content[0].child(0)?.text(),
            unlockLevel: "?",
            unlockCost: "?",
            module: content[2].child(0)?.text(),
            traits: content[3].child(0)?.text().split("  •  "),
            code: content[4].find(".//img/@src").map((a) =>
              parseArrow(
                a
                  .toString()
                  .replace(/^\s+src="/, "")
                  .replace(/"$/, "")
              )
            ),
          }
        : {
            permitType: content[0].child(0)?.text(),
            unlockLevel: "1",
            unlockCost: content[1].child(0)?.text().replace(/^\s+/g, ""),
            module: "Warbond",
            traits: content[2].child(0)?.text().split("  •  "),
            code: content[3].find(".//img/@src").map((a) =>
              parseArrow(
                a
                  .toString()
                  .replace(/^\s+src="/, "")
                  .replace(/"$/, "")
              )
            ),
          }
    ) as Stratagem;

    entry.name =
      table
        .get("h2")
        ?.toString()
        .replace(/<[^>]+>/g, "") ?? "";
    entry.icon = icon;

    entry.uses = uses;
    entry.cooldown = cooldown;

    stratagems.push(entry);
  }

  // const missionStratagemTraits = doc.find("//table[contains(@class, 'wikitable')][2]/tbody/tr/th").slice(5);
  const missionStratagems = doc
    .find("//table[contains(@class, 'wikitable')][2]/tbody/tr")
    .slice(1)
    .map((a) => a.childNodes());

  let lastTrait = "";

  const usesMap = {
    Reinforce: 5,
    "SoS Beacon": 1,
  };

  const cooldownMap = {
    "SEAF Artillery": 11,
    Ressuply: 180,
  };

  const missionStratagemsParsed = missionStratagems.map((a) => {
    if (a.length == 10) {
      lastTrait = a[1].text().replace("\n", "");
      a = a.slice(2);
    }
    const name = a[3].text().replace("\n", "");
    const entry: Stratagem = {
      icon: a[1].find(".//img/@src")[0]?.child(0)?.text() ?? null,
      name,
      permitType: "Mission Stratagem",
      unlockLevel: "1",
      unlockCost: "Already Unlocked",
      module: "Mission",
      traits: [lastTrait],
      code: a[5]
        .find(".//img/@src")
        .map((n) => parseArrow(n.child(0)?.text() ?? "")),
      uses: name in usesMap ? usesMap[name as keyof typeof usesMap] : 0,
      cooldown:
        name in cooldownMap ? cooldownMap[name as keyof typeof cooldownMap] : 0,
    };
    return entry;
  });

  stratagems.push(...missionStratagemsParsed);

  return stratagems;
}
