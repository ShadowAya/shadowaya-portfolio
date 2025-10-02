import wtf from "wtf_wikipedia";

export type Stratagem = {
    name: string;
    icon: string | null;
    permitType: string;
    unlockLevel: string;
    unlockCost: string;
    module: string;
    traits: string[];
    code: ("up" | "right" | "left" | "down")[];
    cooldown: number | null;
    uses: number | null;
};

type WikiPage = {
    title: string;
    content: string;
};

type CharOrDecode = "decode" | (string & {});

type OptsOne = Partial<{
    newlines: boolean;
    spaces: CharOrDecode;
    numFirst: boolean | "strip";
}>;

type OptsList = Partial<{
    newlines: boolean;
    spaces: CharOrDecode;
    numFirst: boolean | "strip";
}> & {
    list: string | RegExp;
};

type OptsNum = Partial<{
    newlines: boolean;
    spaces: CharOrDecode;
    numFirst: boolean | "strip";
}> & {
    asNumber: true;
};

function modText(
    text: string | Record<any, any> | undefined
): string | undefined;
function modText(
    text: string | Record<any, any> | undefined,
    options: OptsNum
): number | undefined;
function modText(
    text: string | Record<any, any> | undefined,
    options: OptsList
): string[] | undefined;
function modText(
    text: string | Record<any, any> | undefined,
    options: OptsOne
): string | undefined;
function modText(
    text: string | Record<any, any> | undefined,
    options: OptsOne | OptsList = {}
): string | string[] | number | undefined {
    if (!text) return undefined;

    let out: string;
    if (typeof text === "string") {
        out = text;
    } else {
        out = text.text;
    }

    // out = out.replace(/\\n/g, options.newlines ? '\n' : '');

    if (options.spaces?.length === 1) {
        out = out.replace(/\s/g, options.spaces);
    } else if (options.spaces === "decode") {
        out = out.replace(/_/g, " ");
    }

    if (options.numFirst) {
        const match = out.match(/(\d+)/);
        if (match) {
            const number = match[1];
            const numberIndex = match.index!;
            const beforeNumber = out.substring(0, numberIndex).trim();

            if (options.numFirst === "strip") {
                out = `${number} ${beforeNumber}`.trim();
            } else {
                const afterNumber = out
                    .substring(numberIndex + number.length)
                    .trim();
                out = `${number} ${beforeNumber}${
                    afterNumber ? " " + afterNumber : ""
                }`.trim();
            }
        }
    }

    if ("asNumber" in options && options.asNumber) {
        if (out.toLowerCase() === "unlimited") return 0;
        const numberMatch = out.match(/-?\d+(?:\.\d+)?/);
        if (!numberMatch) return undefined;
        return parseInt(numberMatch[0], 10);
    } else if ("list" in options && options.list) {
        return out.split(options.list);
    }

    return out;
}

function getLink1FromWikitext(wikitext: string) {
  const regex = /{{\s*Tabs[\s\S]*?\|\s*link1\s*=\s*([^|}]+)[\s\S]*?}}/i;

  const match = wikitext.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

function parseCodeFromWikitext(wikitext: string) {
    const codeMatch = wikitext.match(/\{\{stratagem[_ ]code\|([^}]+)\}\}/i);
    const code: Stratagem["code"] = codeMatch
        ? (codeMatch[1].split("|").filter(Boolean) as (
              | "up"
              | "right"
              | "left"
              | "down"
          )[])
        : [];
    return code;
}

function parseIconFileLink(link: string) {
    const match = link.match(/\[\[([^|]+)\|/);
    return match ? match[1] : undefined;
}

function parseStratagemPage(wikitext: string, title: string): Stratagem | null {
    const wt = wtf(wikitext.replace(/\{\{\s*PAGENAME\s*\}\}/gi, title));
    const main = wt.infobox(0)?.json() as Record<string, any>;

    const statsSection = wt.section("Stratagem Statistics");
    const statsTemplates = statsSection
        ? (statsSection.templates?.() as Record<string, any>[])?.[0]?.json?.()
        : undefined;
    const statsTables: any = statsSection
        ? (statsSection.tables?.() as Record<string, any>[])?.[0]?.json?.()
        : undefined;

    let cooldown: number | null = null;
    let uses: number | null = null;
    if (statsTemplates) {
        cooldown = modText(statsTemplates.cooldown, { asNumber: true }) ?? 0;
        uses = modText(statsTemplates.uses, { asNumber: true }) ?? 0;
    } else if (statsTables) {
        let keyOrderCooldown: string[] = []
        const cooldownCell = statsTables.find(
            (v: any) => {
                keyOrderCooldown = Object.keys(v);
                return v[keyOrderCooldown[0]].text.toLowerCase() === "cooldown" &&
                v[keyOrderCooldown[1]].text.toLowerCase() === "standard"
            }
                
        );
        if (cooldownCell) {
            cooldown = modText(cooldownCell[keyOrderCooldown[2]], { asNumber: true }) ?? 0;
        }
        let keyOrderUses: string[] = []
        const usesCell = statsTables.find(
            (v: any) => {
                keyOrderUses = Object.keys(v);
                return v[keyOrderUses[0]].text.toLowerCase() === "uses"
            }
        );
        if (usesCell) {
            uses = modText(usesCell[keyOrderUses[1]], { asNumber: true }) ?? 0;
        }
    }

    if (!main) return null;

    const code = parseCodeFromWikitext(wikitext);
    const icon = modText(main.image);

    return {
        name: modText(main.title) ?? getLink1FromWikitext(wikitext) ?? title.replaceAll('_', '') ?? '????',
        icon: icon ? `File:${icon}` : null,
        permitType: modText(main.permit_type) ?? "Unknown",
        unlockLevel: modText(main.unlock_level) ?? "N/A",
        unlockCost: modText(main.unlock_cost, { numFirst: "strip" }) ?? "N/A",
        module: modText(main.ship_module) ?? "Unknown",
        traits: modText(main.traits, { list: " * " }) ?? [],
        code,
        cooldown,
        uses,
    };
}

const STATIC_USES = {
    Reinforce: 5,
    "SoS Beacon": 1,
} as const;

const STATIC_COOLDOWNS = {
    "SEAF Artillery": 11,
    Resupply: 180,
    Hellbomb: 30,
} as const;

function parseEntry(wikitext: string) {
    const wt = wtf(wikitext);
    const list = (
        wt.section("Current Stratagems")?.tables() as Record<string, any>[]
    ).map((t) =>
        t
            .links()
            .map((l: any) => l.href().replaceAll("\\", "").replace(/^\.\//, ""))
    );

    const stratagems: Stratagem[] = [];
    const table = (
        wt.section("Mission Stratagems")?.tables() as Record<any, any>[]
    )[0];

    if (!table) return { stratagems, list };

    let trait: string = "Unknown";
    for (const data of table.data) {
        let name: string, icon: string | null;
        if ("Description" in data) {
            trait = data["Type"].text();
            icon = parseIconFileLink(data["Icon"].data.wiki) ?? null;
            name = data["Stratagem"].text();
        } else {
            icon = parseIconFileLink(data["Type"].data.wiki) ?? null;
            name = data["Icon"].text();
        }
        // Find the table row for this stratagem name
        const rowRegex = new RegExp(`\\[\\[(?:[^\\]\\n]*\\|)*${name}\\]\\]\\s*\\n.*?\\n`, "si");
        const rowMatch = wikitext.match(rowRegex);
        const code = rowMatch ? parseCodeFromWikitext(rowMatch[0]) : [];
        stratagems.push({
            name,
            icon,
            permitType: "Mission Stratagem",
            unlockLevel: "1",
            unlockCost: "Already unlocked",
            module: "Mission",
            traits: [trait],
            code,
            uses:
                name in STATIC_USES
                    ? STATIC_USES[name as keyof typeof STATIC_USES]
                    : 0,
            cooldown:
                name in STATIC_COOLDOWNS
                    ? STATIC_COOLDOWNS[name as keyof typeof STATIC_COOLDOWNS]
                    : 0,
        });
    }

    return { stratagems, list };
}

// https://helldivers.wiki.gg/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Stratagems

////////////////////////////////// RUN

const USER_AGENT =
    "Stratle/1.0 (+https://shadowaya.me/stratle; contact@shadowaya.me)";

const DEFAULT_DELAY_SEC = 1;
const DEFAULT_JITTER_SEC = 0.5;

const API_ENDPOINT = "https://helldivers.wiki.gg/api.php";
const MAX_REDIRECT_DEPTH = 5;

let lastRequestTime = 0;

async function sleep(ms: number) {
    await new Promise<void>((r) => setTimeout(r, ms));
}

async function rawFetch(searchParams: URLSearchParams, init: RequestInit = {}) {
    const now = Date.now();
    const sinceLast = now - lastRequestTime;
    const minDelayMs = DEFAULT_DELAY_SEC * 1000;
    const jitterMs =
        DEFAULT_JITTER_SEC > 0 ? Math.random() * DEFAULT_JITTER_SEC * 1000 : 0;

    if (sinceLast < minDelayMs) {
        await sleep(minDelayMs - sinceLast + jitterMs);
    } else if (jitterMs > 0) {
        await sleep(jitterMs);
    }

    const headers = new Headers(init.headers ?? {});
    if (!headers.has("User-Agent")) {
        headers.set("User-Agent", USER_AGENT);
    }
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    const url = `${API_ENDPOINT}?${searchParams.toString()}`;

    const response = await fetch(url, {
        ...init,
        headers,
    });

    lastRequestTime = Date.now();

    if (!response.ok) {
        throw new Error(
            `Request to ${url} failed with status ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}

async function fetchWikiPage(
    titles: string | string[],
    init: RequestInit = {}
): Promise<WikiPage[]> {
    const titlesParam = Array.isArray(titles) ? titles.join("|") : titles;
    const searchParams = new URLSearchParams({
        action: "query",
        prop: "revisions",
        rvprop: "content",
        format: "json",
        titles: titlesParam,
    });
    const body = await rawFetch(searchParams, init);
    const pages = body?.query?.pages as Record<string, any> | undefined;
    if (!pages || typeof pages !== "object") {
        throw new Error("No pages in response");
    }

    const results: WikiPage[] = [];
    for (const page of Object.values(pages) as any[]) {
        const revision = page.revisions?.[0];
        if (!revision) {
            throw new Error(
                `No revisions found for page ${page.title ?? "(unknown)"}`
            );
        }

        const content: string | undefined =
            revision["*"] ??
            revision.slots?.main?.["*"] ??
            revision.slots?.main?.content;

        if (!content) {
            throw new Error(
                `Revision for page ${
                    page.title ?? "(unknown)"
                } did not include wikitext content`
            );
        }

        results.push({
            title: page.title as string,
            content,
        });
    }

    if (results.length === 0) {
        throw new Error("No page content returned from response");
    }

    return results;
}

async function fetchImageURLs(stratagems: Stratagem[], init: RequestInit = {}) {
    const titlesParam = stratagems.map((s) => s.icon).join("|");
    const searchParams = new URLSearchParams({
        action: "query",
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        titles: titlesParam,
    });
    const body = await rawFetch(searchParams, init);

    const normalizations: Record<string, string> = {};
    if (body.query.normalized) for (const norm of body.query.normalized) {
        normalizations[norm.to] = norm.from;
    }

    const pages = body?.query?.pages as Record<string, any> | undefined;
    if (!pages || typeof pages !== "object") {
        throw new Error("No pages in response");
    }

    const mappings: Record<string, string> = {};
    for (const page of Object.values(pages) as any[]) {
        const title =
            page.title in normalizations
                ? normalizations[page.title]
                : page.title;
        const url = page.imageinfo[0].url;
        mappings[title] = url;
    }
    for (const stratagem of stratagems) {
        stratagem.icon = stratagem.icon
            ? mappings[stratagem.icon]
                ? mappings[stratagem.icon]
                : null
            : null;
    }
}

async function resolveRedirect(page: WikiPage, depth = 0): Promise<WikiPage> {
    if (depth >= MAX_REDIRECT_DEPTH) {
        throw new Error(
            `Redirect depth exceeded while resolving ${page.title}`
        );
    }

    const redirectMatch = page.content
        .trim()
        .match(/^#redirect\s*\[\[(.+?)\]\]/i);

    if (!redirectMatch) {
        return page;
    }

    const targetRaw = redirectMatch[1].split("|")[0].trim();
    const target = targetRaw.split("#")[0].trim();
    if (!target) {
        throw new Error(`Redirect page ${page.title} did not specify a target`);
    }

    const [resolved] = await fetchWikiPage(target.replace(/\s+/g, " "));
    if (!resolved) {
        throw new Error(`Failed to resolve redirect target ${target}`);
    }

    return resolveRedirect(resolved, depth + 1);
}

export default async function getAllStratagems() {
    try {
        const rootPage = await fetchWikiPage("Stratagems");
        const firstPage = rootPage[0];
        if (!firstPage) {
            throw new Error("Empty page list returned from API");
        }

        const parsed = parseEntry(firstPage.content);

        const stratagems = [...parsed.stratagems];
        await fetchImageURLs(stratagems);
        const pageNames = parsed.list.flat().filter(Boolean);

        const uniqueNames = Array.from(new Set(pageNames));
        const batchSize = 30;

        for (let start = 0; start < uniqueNames.length; start += batchSize) {
            const newStratagems: Stratagem[] = [];
            const batch = uniqueNames.slice(start, start + batchSize);
            const pages = await fetchWikiPage(batch);
            for (const page of pages) {
                try {
                    const resolvedPage = await resolveRedirect(page);
                    const stratagem = parseStratagemPage(
                        resolvedPage.content,
                        resolvedPage.title
                    );
                    if (stratagem) {
                        newStratagems.push(stratagem);
                    }
                } catch (err) {
                    console.warn(`Skipping ${page.title ?? "(unknown)"}:`, err);
                }
            }
            await fetchImageURLs(newStratagems);
            stratagems.push(...newStratagems);
        }

        return stratagems;
    } catch (error) {
        console.error("Failed to fetch stratagem entry:", error);
        throw error;
    }
}