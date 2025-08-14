import { unstable_noStore as noStore } from 'next/cache';

// Instagramの投稿データの型を定義
export interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  thumbnail_url?: string; // 動画のサムネイル用
  timestamp: string;
  username?: string;
  children?: { data: { id: string; media_url: string; media_type: 'IMAGE' | 'VIDEO' }[] };
}

export async function getInstagramFeed(): Promise<InstagramPost[]> {
  // 手動更新のためキャッシュを無効化
  noStore();

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!token || !businessId) {
    console.error("Instagram API credentials are not defined in .env.local");
    return [];
  }
  
  // 動画のサムネイルも取得するため、thumbnail_url を追加
  const fields = "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp";
  const url = `https://graph.facebook.com/v19.0/${businessId}/media?fields=${fields}&access_token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to fetch Instagram feed: ${res.statusText} - ${errorData.error.message}`);
    }
    const { data } = await res.json();
    // 最新6件のみ表示する例
    return data.slice(0, 6);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// IDを指定して単一の投稿を取得する関数
export async function getInstagramPost(id: string): Promise<InstagramPost | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.error("Instagram access token is not defined.");
    return null;
  }
  
  // 必要な情報をすべて取得するため、フィールドを少し増やします
  const fields = "id,caption,media_url,media_type,permalink,timestamp,username,children{media_url,media_type}";
  const url = `https://graph.facebook.com/v19.0/${id}?fields=${fields}&access_token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to fetch post ${id}: ${res.statusText} - ${errorData.error.message}`);
    }
    const post: InstagramPost = await res.json();
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}