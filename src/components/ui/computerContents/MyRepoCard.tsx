'use client';

import RepoCard from "react-repo-card";

export default function MyRepoCard({repo}: {repo: string}) {

    return (
        <RepoCard
            username="ShadowAya"
            repository={repo}
        />
    )

}