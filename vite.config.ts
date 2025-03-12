import { defineConfig } from "vite"; //  defineConfig: Vite 구성에 타입스크립트 지원을 제공하는 유틸리티 함수
import react from "@vitejs/plugin-react"; // React JSX를 처리하기 위한 Vite 공식 플러그인
import { ManifestOptions, VitePWA } from "vite-plugin-pwa"; // PWA 기능을 추가하기 위한 플러그인

// 기존 ManifestOptions 타입을 확장
interface CustomManifestOptions extends ManifestOptions {
  gcm_sender_id?: string;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // React 지원 활성화
    react(),
    // PWA 설정
    VitePWA({
      registerType: "autoUpdate", // 서비스 워커 등록방식 - autoUpdate: 새버전이 감지되면 자동 업데이트
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"], // 서비스 워커가 캐시할 정적 파일들을 지정
      manifest: {
        // 매니페스트 설정
        name: "My PWA App", // 앱의 이름
        short_name: "MyPWA", // 홈 화면에 표시될 짧은 이름
        description: "My Awesome PWA App", // 앱에 대한 설명
        theme_color: "#ffffff", // 브라우저 UI 요소(상태 바 등)의 색상 지정
        // 푸시 알림을 위한 추가 설정
        gcm_sender_id: "YOUR_SENDER_ID", // Firebase Cloud Messaging을 사용하는 경우
        icons: [
          // 아이콘 설정
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // 마스크 가능한 아이콘을 지정(안드로이드의 적응형 아이콘 요구사항을 충족시키기 위해 사용, 아이콘이 원형, 사각형, 등 다양한 모양으로 표시될 수 있게 함)
          },
        ],
      } as CustomManifestOptions,
      // 기본 설정
      workbox: {
        globDirectory: "dist",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,json}"], // 캐시할 파일 패턴 지정. 이 패턴과 일치하는 모든 파일이 사전 캐시
        runtimeCaching: [
          // 런타임 시 캐시 전략을 정의
          {
            // 정규식으로 캐시할 URL 패턴을 지정(🚨 실제 사용하는 API 도메인으로 변경)
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: "NetworkFirst", // 캐싱전략 지정
            // NetworkFirst: 먼저 네트워크에서 요청을 시도하고, 실패하면 캐시를 사용
            // CacheFirst: 먼저 캐시에서 찾고, 없으면 네트워크에 요청
            options: {
              cacheName: "api-cache",
              expiration: {
                // 캐시 만료 설정
                maxEntries: 10, // 캐시에 저장할 최대 항목 수
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1주일 - 캐시 항목의 최대 수명(초단위)
              },
              cacheableResponse: {
                // 어떤 응답을 캐시할지 결정
                statuses: [0, 200], // 캐시할 HTTP 상태코드
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // 개발중에도 PWA 테스트
      devOptions: {
        enabled: true, // 개발 모드에서도 PWA 기능 활성화
        type: "module", // 서비스 워커를 ES 모듈로 로드
        navigateFallback: "index.html", // 모든 탐색 요청이 index.html 폴백 되도록 함.(SPA 라우팅용)
      },

      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
    }),
  ],
});
