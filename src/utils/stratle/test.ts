import { getStratagemList, getStratagemListCached } from "./utils";

(async () => {
    const a = await getStratagemList();
    console.log(a);
})();