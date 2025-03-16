import { api, HydrateClient } from "~/trpc/server";
import { Ranking } from "./_components/ranking";
import { BackToTop } from "./_components/back-to-top";
export default async function Home() {
  const pageNumber = 1;
  const pageSize = 50;
  void api.github.getChinaGitHubRankingData.prefetch({ pageNumber, pageSize });

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
