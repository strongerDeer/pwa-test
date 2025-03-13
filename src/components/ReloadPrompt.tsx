// [!] PWA의 서비스 워커 상태를 관리하고 사용자에게 알리는 컴포넌트

// Vite PWA 플러그인이 제공하는 React 훅을 가져옴. 서비스 워커 등록 및 업데이트 관리
import { useRegisterSW } from "virtual:pwa-register/react";
import { useState, useEffect } from "react";
import "./ReloadPrompt.css";

function ReloadPrompt() {
  // useRegisterSW를 사용하여 서비스 워커 상태 및 제어 함수를 가져옴
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const [close, setClose] = useState(false);

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setClose(false);
    }
  }, [offlineReady, needRefresh]);

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setClose(true);
  };

  if (close) {
    return null;
  }

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>앱이 오프라인에서 사용 가능합니다</span>
            ) : (
              <span>새 버전이 있습니다</span>
            )}
          </div>
          <div className="ReloadPrompt-buttons">
            {needRefresh && (
              <button
                className="ReloadPrompt-reload"
                onClick={() => updateServiceWorker(true)}
              >
                새로고침
              </button>
            )}
            <button className="ReloadPrompt-close" onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReloadPrompt;
