import { getInstagramFeed, InstagramPost } from '../lib/instagram';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns'; // 日付フォーマット用のライブラリ
import { FaInstagram } from 'react-icons/fa'; 

// 投稿１件分のデザインコンポーネント
function BlogListItem({ post }: { post: InstagramPost }) {
  // ISO形式の日付文字列をDateオブジェクトに変換
  const postDate = new Date(post.timestamp);

  return (
    <Link href={`/blog/${post.id}`} className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* 左側: 画像 */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
        <div className="aspect-square relative rounded-md overflow-hidden">
          <Image
            src={post.thumbnail_url || post.media_url}
            alt={post.caption?.substring(0, 50) || 'Instagram Post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* 右側: テキスト情報 */}
      <div className="w-full md:w-2/3 lg:w-3/4">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          {post.caption ? post.caption.split('\n')[0] : 'Instagram Post'}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.caption}
        </p>
        <div className="text-sm text-gray-500">
          投稿日: {format(postDate, 'yyyy年MM月dd日')}
        </div>
      </div>
    </Link>
  );
}


// ブログ一覧ページの本体
export default async function BlogPage() {
  const posts = await getInstagramFeed();

  if (!posts || posts.length === 0) {
    return <p>投稿が見つかりませんでした。</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <p className="mb-6">研究室での活動の様子を紹介します。インスタグラムに投稿されている内容と同じです!</p>
      <Link 
          href="https://www.instagram.com/affective_laboratory/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
        >
          <FaInstagram size={20} />
          <span>研究室の公式インスタグラムはこちらから!!</span>
        </Link>
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

