import { unstable_cacheLife as cacheLife } from "next/cache";
import MyRepoCard from "./ui/computerContents/MyRepoCard";

interface MyRepoCardCachedProps {
  repo: string;
}

export default async function MyRepoCardCached({
  repo,
}: MyRepoCardCachedProps) {
  "use cache";
  cacheLife("minutes");

  return <MyRepoCard repo={repo} />;
}
