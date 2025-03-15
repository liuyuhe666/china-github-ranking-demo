import Link from "next/link";
import Image from "next/image";

import { api, HydrateClient } from "~/trpc/server";
import { env } from "~/env";

export default async function Home() {
  const data = await api.github.getChinaGitHubRankingData();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            China <span className="text-[hsl(280,100%,70%)]">GitHub</span>{" "}
            Ranking
          </h1>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  头像
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  用户名
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  链接
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.username}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Image
                      src={`${env.NEXT_PUBLIC_IMAGE_PROXY_URL}?url=${item.avatar}`}
                      alt={item.username}
                      width={50}
                      height={50}
                      className="inline-block rounded-full"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Link href={item.url} target="_blank" rel="noreferrer">
                      {item.username}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Link href={item.url} target="_blank" rel="noreferrer">
                      {item.url}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </HydrateClient>
  );
}
