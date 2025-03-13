// 기본 서비스 워커 import (WorkboxSW)
// 웹 애플리케이션의 리소스를 미리 캐시하고 라우팅하는 데 사용
import { precacheAndRoute } from "workbox-precaching";

// Workbox 생성 precache manifest 사용
// Vite의 PWA 플러그인이 빌드 시 생성하는 __WB_MANIFEST 변수를 사용하여 필요한 리소스를 미리 캐시
// 이 변수에는 캐시해야 할 모든 정적 자산 목록이 포함
precacheAndRoute(self.__WB_MANIFEST);

// 푸시 이벤트 리스너 추가
self.addEventListener("push", (event) => {
  // 수신된 푸시 메시지의 데이터를 JSON으로 파싱
  // 데이터가 없거나 파싱할 수 없는 경우 기본 메시지를 사용
  const data = event.data?.json() || {
    title: "새 알림",
    body: "새로운 업데이트가 있습니다.",
  };

  const options = {
    body: data.body, // 알림 메시지의 본문
    icon: "pwa-192x192.png", // 알림에 표시될 큰 아이콘
    badge: "pwa-192x192.png", // 작은 상태 표시줄 아이콘(주로 모바일 기기에서 사용)
    data, // 나중에 알림 클릭 이벤트에서 접근할 수 있도록 원본 푸시 데이터 저장
  };

  // 알림 표시
  // event.waitUntil()은 푸시 이벤트 처리가 완료될 때까지 서비스 워커가 종료되지 않도록 함
  // self.registration.showNotification()은 실제로 사용자에게 알림을 표시하는 함수
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭 이벤트 리스너
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // 사용자가 클릭한 알림 닫기

  // 알림 클릭 시 특정 페이지로 이동
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
