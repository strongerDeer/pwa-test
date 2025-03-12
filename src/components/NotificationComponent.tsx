import { useState, useEffect } from "react";

function NotificationComponent() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // 공개 VAPID 키
  const publicVapidKey =
    "BL-vx7qLLKws-hwgbEPilwRjj0xeDvfqQyg6Ws5rLj2ZgsIdCmwjJ3zCJtTct8qg5CSJHCB2e25WT0-eqJXzbkU";

  useEffect(() => {
    // 서비스 워커 등록 확인
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          setRegistration(reg);
          return reg.pushManager.getSubscription();
        })
        .then((sub) => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
    }
  }, []);

  // 푸시 알림 구독 함수
  const subscribeToNotifications = async (): Promise<void> => {
    if (!registration) return;

    try {
      // 권한 요청
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("알림 권한이 거부되었습니다.");
        return;
      }

      // VAPID 키를 Uint8Array로 변환
      const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

      // 구독 생성
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // 서버에 구독 정보 전송
      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(sub),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("구독 성공!");
    } catch (error) {
      console.error("구독 오류:", error);
    }
  };

  // 구독 취소 함수
  const unsubscribeFromNotifications = async (): Promise<void> => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);

      // 서버에 구독 취소 알림
      await fetch("/api/unsubscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("구독 취소 성공!");
    } catch (error) {
      console.error("구독 취소 오류:", error);
    }
  };

  // Base64 문자열을 Uint8Array로 변환하는 유틸리티 함수
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div>
      <h2>알림 설정</h2>
      {isSubscribed ? (
        <button onClick={unsubscribeFromNotifications}>알림 구독 취소</button>
      ) : (
        <button onClick={subscribeToNotifications}>알림 구독하기</button>
      )}
    </div>
  );
}

export default NotificationComponent;
