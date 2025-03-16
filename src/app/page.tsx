import { HydrateClient, api } from "~/trpc/server";
import { Ranking } from "./_components/ranking";
import { BackToTop } from "./_components/back-to-top";

// 使用动态渲染，避免构建时预渲染
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  try {
    await Promise.all([
      api.github.getChinaGitHubRankingData.prefetch({
        pageNumber: 1,
        pageSize: 50,
      }),
      api.github.getChinaGitHubRankingDataTotal.prefetch(),
    ]);
  } catch (error) {
    console.error("Failed to prefetch data:", error);
    // 继续渲染页面，让客户端重试数据获取
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="hidden text-5xl font-extrabold tracking-tight sm:text-[5rem] md:block">
            China <span className="text-[hsl(280,100%,70%)]">GitHub</span>{" "}
            Ranking
          </h1>
          <Ranking />
          <span className="text-sm text-gray-400 md:hidden">
            请使用 PC 端查看，或旋转手机屏幕
          </span>
        </div>
      </main>
      <BackToTop />
    </HydrateClient>
  );
}
