import moment from "moment-timezone";
import { unstable_cacheLife as cacheLife } from "next/cache";

export async function getAge() {
  "use cache";
  cacheLife("hours");

  const birthday = moment.tz(new Date(2004, 0, 27), "Europe/Prague");
  const age = moment.tz("Europe/Prague").diff(birthday, "years");
  return age;
}
