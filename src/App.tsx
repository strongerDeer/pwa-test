import { useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";

import "./App.css";

function App() {
  const [currentChannelUrl, setCurrentChannelUrl] = useState<string>();

  return (
    <>
      <div className="App">
        <SendbirdProvider
          appId={import.meta.env.VITE_APP_ID}
          userId={import.meta.env.VITE_USER_ID}
          accessToken={import.meta.env.VITE_ACCESS_TOKEN}
          nickname="닉네임을 넣어줘"
        >
          <div className="sendbird-app__channellist-wrap">
            <GroupChannelList
              selectedChannelUrl={currentChannelUrl}
              onChannelCreated={(channel) => {
                setCurrentChannelUrl(channel.url);
              }}
              onChannelSelect={(channel) => {
                setCurrentChannelUrl(channel?.url);
              }}
            />
          </div>
          <div className="sendbird-app__conversation-wrap">
            <GroupChannel
              channelUrl={currentChannelUrl!}
              // 대화방 헤더 커스텀
              renderChannelHeader={() => <div>Header</div>}
              renderMessage={(props) => {
                console.log(props);

                // console.log(import.meta.env.VITE_USER_ID);

                const { chainBottom, chainTop, message } = props;
                return <div>{message.message}</div>;
              }}
            />
          </div>
        </SendbirdProvider>
      </div>
    </>
  );
}

export default App;
