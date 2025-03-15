import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";

interface Item {
  avatar: string;
  username: string;
  url: string;
}

const url = env.GITHUB_DATA_URL;

export const githubRouter = createTRPCRouter({
  getChinaGitHubRankingData: publicProcedure.query(async () => {
    const response = await fetch(url);
    return (await response.json()) as Item[];
  }),
});
