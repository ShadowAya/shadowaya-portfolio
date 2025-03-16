"use client";

import AppItem from "@/components/phone-setup/AppItem";
import { apps } from "@/utils/phone-setup/data";
import styles from "./page.module.scss";
import { tags as taglist, type TagList } from "@/utils/phone-setup/data";
import { useState } from "react";
import cn from "classnames";

export default function Page() {
  const [tags, setTags] = useState<TagList>([]);

  const appsFiltered = tags.length
    ? apps.filter((app) => tags.some((tag) => app.tags.includes(tag)))
    : apps;

  return (
    <div className={styles.container}>
      <div className={styles.tags}>
        <span>Filter</span>
        <div>
          {taglist.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tags.includes(tag)) {
                  setTags(tags.filter((t) => t !== tag));
                } else {
                  setTags([...tags, tag]);
                }
              }}
              className={cn(styles.tag, tags.includes(tag) && styles.active)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {appsFiltered.map((app) => (
        <AppItem key={app.name} app={app} />
      ))}
    </div>
  );
}
