// 기본 서비스 워커 import (WorkboxSW)
import { precacheAndRoute } from "workbox-precaching";

// Workbox 생성 precache manifest 사용
precacheAndRoute(self.__WB_MANIFEST);

// 푸시 이벤트 리스너 추가
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "새 알림",
    body: "새로운 업데이트가 있습니다.",
  };

  const options = {
    body: data.body,
    icon: "pwa-192x192.png",
    badge: "pwa-192x192.png",
    data,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭 이벤트 리스너
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 알림 클릭 시 특정 페이지로 이동
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
