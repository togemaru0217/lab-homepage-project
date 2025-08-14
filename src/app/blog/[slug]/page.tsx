// app/blog/[slug]/page.tsx

// ▼ 修正点①: パスをエイリアスに戻す
import { getInstagramFeed, getInstagramPost } from '@/lib/instagram'; 
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import ImageCarousel from '@/components/ImageCarousel';

// generateStaticParamsで返すパラメータ名を 'slug' に合わせる
export async function generateStaticParams() {
  const posts = await getInstagramFeed();
  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.id, // ▼ 修正点②: 'id' から 'slug' に変更
  }));
}

// generateMetadataで受け取るパラメータ名を 'slug' に合わせる
export async function generateMetadata({ params }: { params: { slug: string } }) { // ▼ 修正点③
  const post = await getInstagramPost(params.slug); // ▼ 修正点③
  if (!post) {
    return { title: '投稿が見つかりません' };
  }
  const title = post.caption ? post.caption.split('\n')[0] : 'Instagram Post';
  return {
    title: title,
    description: post.caption?.substring(0, 160),
  };
}

// ページの本体で受け取るパラメータ名も 'slug' に合わせる
export default async function BlogPostPage({ params }: { params: { slug: string } }) { // ▼ 修正点④
  const post = await getInstagramPost(params.slug); // ▼ 修正点④

  if (!post) {
    notFound();
  }

  const title = post.caption ? post.caption.split('\n')[0] : 'Instagram Post';
  const postDate = new Date(post.timestamp);

  const imageUrls = post.media_type === 'CAROUSEL_ALBUM' && post.children
    ? post.children.data.map(child => child.media_url)
    : [post.media_url];

  return (
    <article className="container mx-auto py-12">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center leading-tight">
          {title}
        </h1>
      </header>
      <div className="mb-8">
        <ImageCarousel imageUrls={imageUrls} altText={title} />
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>投稿日: {format(postDate, 'yyyy年MM月dd日 HH:mm')}</span>
          <Link href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Instagramで見る
          </Link>
        </div>
        <div className="prose lg:prose-xl max-w-none">
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {post.caption}
          </p>
        </div>
      </div>
    </article>
  );
}