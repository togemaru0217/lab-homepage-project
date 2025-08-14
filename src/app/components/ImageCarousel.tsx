'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import Image from 'next/image';

// SwiperのCSSをインポート
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ImageCarouselProps = {
  imageUrls: string[];
  altText: string;
};

export default function ImageCarousel({ imageUrls, altText }: ImageCarouselProps) {
  return (
    <Swiper
      // Swiperのモジュールを設定
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation // 左右の矢印
      pagination={{ clickable: true }} // 下のドット
      loop={true} // 無限ループ
      className="w-full max-w-4xl mx-auto rounded-lg"
    >
      {imageUrls.map((url, index) => (
        <SwiperSlide key={index}>
          <div className="relative aspect-square">
            <Image
              src={url}
              alt={`${altText} - 画像${index + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}