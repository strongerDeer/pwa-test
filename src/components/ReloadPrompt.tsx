import { useRegisterSW } from "virtual:pwa-register/react";
import { useState, useEffect } from "react";
import "./ReloadPrompt.css";

function ReloadPrompt() {
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
