import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    // 필요한 경우 사용자에게 새로고침 요청
    if (confirm("새 버전이 있습니다. 업데이트하시겠습니까?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    // 오프라인 사용 준비 완료 알림
    alert("앱이 오프라인에서도 사용할 준비가 되었습니다!");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
