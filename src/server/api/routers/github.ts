import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

interface Item {
  avatar: string;
  username: string;
  url: string;
}

interface ItemWithIndex extends Item {
  index: number;
}

const url = env.GITHUB_DATA_URL;

// 添加内存缓存
let cachedData: Item[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

const fetchWithRetry = async (url: string, retries = 3): Promise<Item[]> => {
  // 检查缓存
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
        },
        // 添加超时设置
        signal: AbortSignal.timeout(10000), // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as Item[];

      // 更新缓存
      cachedData = data;
      lastFetchTime = now;

      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        // 如果所有重试都失败了，但我们有缓存数据，就使用缓存数据
        if (cachedData) {
          console.log("Using cached data after all fetch attempts failed");
          return cachedData;
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("All retries failed");
};

export const githubRouter = createTRPCRouter({
  getChinaGitHubRankingData: publicProcedure
    .input(
      z.object({
        pageNumber: z.number().min(1),
        pageSize: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      try {
        const data = await fetchWithRetry(url);
        const dataWithIndex = data.map((item, index) => ({
          ...item,
          index: index + 1,
        })) as ItemWithIndex[];
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
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to fetch data",
          cause: error,
        });
      }
    }),
  getChinaGitHubRankingDataTotal: publicProcedure.query(async () => {
    try {
      const data = await fetchWithRetry(url);
      return data.length;
    } catch (error) {
      console.error("Error fetching GitHub data total:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch data",
        cause: error,
      });
    }
  }),
});
