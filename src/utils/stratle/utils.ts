import { unstable_cacheLife as cacheLife } from "next/cache";
import getAllStratagems from "./parse-wikitext";

export async function getStratagemList() {
    "use cache";
    cacheLife({
        stale: 60 * 60 * 1, // 1h
        revalidate: 60 * 60 * 24, // 1d
        expire: 60 * 60 * 48, // 2d
    });

    return await getAllStratagems();
}
