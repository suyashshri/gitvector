/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
// const githubUrl = "https://github.com/docker/genai-stack";

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid Github Url");
  }
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author?.date).getTime() -
      new Date(a.commit.author?.date).getTime()
  );
  //   console.log(JSON.stringify(sortedCommits));

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommit = await filterUnprocessedCommits(
    projectId,
    commitHashes
  );
  const summaryResponses = await Promise.allSettled(
    unprocessedCommit.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash);
    })
  );
  const summaries = summaryResponses.map((response) => {
    if (response.status == "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await prisma.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`Processing commit ${index}`);

      return {
        projectId: projectId,
        commitHash: unprocessedCommit[index]!.commitHash,
        commitMessage: unprocessedCommit[index]!.commitMessage,
        commitAuthorName: unprocessedCommit[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommit[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommit[index]!.commitDate,
        summary: summary,
      };
    }),
  });
  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return (await aiSummariseCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project has no github Url");
  }
  return { project, githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[]
) {
  const processedCommits = await prisma.commit.findMany({
    where: { projectId },
  });

  const unprocessedCommit = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash
      )
  );
  return unprocessedCommit;
}
