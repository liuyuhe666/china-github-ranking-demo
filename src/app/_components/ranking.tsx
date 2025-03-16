"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";

import { env } from "~/env";

export function Ranking() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 50;
  const [data] = api.github.getChinaGitHubRankingData.useSuspenseQuery({
    pageNumber,
    pageSize,
  });
  const [total] = api.github.getChinaGitHubRankingDataTotal.useSuspenseQuery();
  const totalPages = Math.ceil(total / pageSize);
  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="container flex hidden flex-col items-center justify-center md:block">
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
          {data.map((item) => (
            <tr key={item.username}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {item.index}
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
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          className="rounded-md bg-white px-4 py-2 text-black"
          onClick={handlePrevPage}
          disabled={pageNumber === 1}
        >
          上一页
        </button>
        <button
          className="rounded-md bg-white px-4 py-2 text-black"
          onClick={handleNextPage}
          disabled={pageNumber === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
