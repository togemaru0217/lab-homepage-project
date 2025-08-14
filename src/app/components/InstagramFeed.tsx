import { getInstagramFeed } from '../lib/instagram';
import Link from 'next/link';
import Image from 'next/image';

// これはサーバーコンポーネントなので 'use client' は不要です
export default async function InstagramFeed() {
  const posts = await getInstagramFeed();

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
        投稿を読み込めませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link href={post.permalink} key={post.id} target="_blank" rel="noopener noreferrer" className="aspect-square block relative">
          <Image
            // VIDEOまたはCAROUSEL_ALBUMの場合、thumbnail_urlを優先。なければmedia_urlを使う
            src={post.thumbnail_url || post.media_url}
            alt={post.caption?.substring(0, 50) || 'Instagram post'}
            fill
            sizes="(max-width: 768px) 33vw, 100px"
            className="object-cover rounded-sm transition-transform duration-200 hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
}