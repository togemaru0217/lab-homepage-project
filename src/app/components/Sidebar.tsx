'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';

// instagramFeedプロパティを受け取るように型を定義
type SidebarProps = {
  instagramFeed: React.ReactNode;
};


export default function Sidebar({ instagramFeed }: SidebarProps) {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (keyword.trim() !== '') {
      router.push(`/searchresult?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <aside className="p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-md w-full sticky top-24">
      {/* 言語切り替えボタン */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">言語切り替え/Switch Language</h2>
        <div className="flex space-x-3">
          <button className="flex-1 p-2 rounded">
            <Image
              src="/日本国旗.jpg"
              alt="日本国旗"
              width={40}
              height={10}
              className="transition-transform duration-200 hover:scale-110 hover:brightness-110"
              priority
            />
          </button>
          <button className="flex-1 p-2 rounded">
            <Image
              src="/米国国旗.jpg"
              alt="米国国旗"
              width={40}
              height={10}
              className="transition-transform duration-200 hover:scale-110 hover:brightness-110"
              priority
            />
          </button>
        </div>
      </div>

      {/* サイト内検索 */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">サイト内検索</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="検索..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaSearch size={20} />
          </button>
        </div>
      </div>

      {/* Instagram埋め込みエリア（仮） */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">最近のInstagram</h2>
        {/* プレースホルダーを削除し、受け取ったコンポーネントをレンダリング */}
        {instagramFeed}
      </div>

      
    </aside>
  );
}
