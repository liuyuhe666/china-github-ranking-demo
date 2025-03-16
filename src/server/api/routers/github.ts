import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";
import { z } from "zod";

interface Item {
  index: number;
  avatar: string;
  username: string;
  url: string;
}

const url = env.GITHUB_DATA_URL;

export const githubRouter = createTRPCRouter({
  getChinaGitHubRankingData: publicProcedure
    .input(
      z.object({
        pageNumber: z.number().min(1),
        pageSize: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(url);
      const data = (await response.json()) as Item[];
      const dataWithIndex = data.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      const total = Math.ceil(dataWithIndex.length / input.pageSize);
      if (input.pageNumber < 1) {
        return dataWithIndex.slice(0, input.pageSize);
      }
      if (input.pageNumber > total) {
        return dataWithIndex.slice(
          (total - 1) * input.pageSize,
          total * input.pageSize,
        );
      }
      return dataWithIndex.slice(
        (input.pageNumber - 1) * input.pageSize,
        input.pageNumber * input.pageSize,
      );
    }),
  getChinaGitHubRankingDataTotal: publicProcedure.query(async () => {
    const response = await fetch(url);
    const data = (await response.json()) as Item[];
    return data.length;
  }),
});
