"use client";

import { useCallback, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: typeof google;
  }
}

// Google Maps API はこのコンポーネントでのみ読み込む（地図を使うページだけで読み込まれる）
const GOOGLE_MAPS_SRC = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&loading=async&libraries=maps,marker`;

export default function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // onReady はスクリプト読み込み完了時と、読み込み済みの状態でマウントされた時（ページ遷移で戻ってきた時）に呼ばれる
  const initMap = useCallback(async () => {
    if (!mapRef.current || initializedRef.current) return;
    if (!window.google?.maps?.importLibrary) {
      console.error("Google Maps API not ready");
      return;
    }
    initializedRef.current = true;

    const { Map } = (await window.google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const { ColorScheme } = (await window.google.maps.importLibrary('core')) as google.maps.CoreLibrary;

    const map = new Map(mapRef.current, {
      center: { lat: 35.60588880373278, lng: 139.68275167183145 },
      zoom: 18,
      mapId: "4a1d353f7d598e79",
      colorScheme: ColorScheme.DARK,
    });

    const { AdvancedMarkerElement } = (await window.google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    new AdvancedMarkerElement({
      map,
      position: { lat: 35.605798489436275, lng: 139.68274177677952 },
      content: (() => {
        const img = document.createElement("img");
        img.src = "/研究室のマーカーアイコン.png";
        img.style.width = "100px";
        img.style.height = "100px";
        return img;
      })(),
    });
  }, []);

  return (
    <>
      <Script id="google-maps-api" src={GOOGLE_MAPS_SRC} strategy="afterInteractive" onReady={() => void initMap()} />
      <div className="w-full h-96 rounded-lg overflow-hidden" ref={mapRef} />
    </>
  );
}
