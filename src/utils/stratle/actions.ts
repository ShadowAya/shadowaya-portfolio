'use server';

import { getStratagemListCached } from "./utils";

export async function getStratagemList() {

    return getStratagemListCached();

}