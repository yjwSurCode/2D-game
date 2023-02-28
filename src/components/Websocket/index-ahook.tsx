import React, { useRef, useMemo, useEffect } from "react";
import { useWebSocket } from "ahooks";

enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export const SocketDemo = () => {
  console.log(
    "init",
    `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem("userId")}`
  );
  const messageHistory = useRef<any[]>([]);
  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket(
      // "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
      `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem(
        "userId"
      )}`,
      {
        onOpen: () => console.log("opened"),
        onError: (e) => console.log("aa-error", e),
      }
    );

  // messageHistory.current = useMemo(
  //   () => messageHistory.current.concat(latestMessage),
  //   [latestMessage]
  // );

  useEffect(() => {
    console.log("ws", latestMessage);
  }, [latestMessage]);

  return (
    <div>
      {/* send message */}
      <button
        onClick={() => sendMessage && sendMessage("66666")}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ✉️ send
      </button>
      {/* disconnect */}
      <button
        onClick={() => {
          console.log("disconnect");
          disconnect && disconnect();
        }}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ❌ disconnect
      </button>
      {/* connect */}
      <button
        onClick={() => connect && connect()}
        disabled={readyState === ReadyState.Open}
      >
        {readyState === ReadyState.Connecting ? "connecting" : "📞 connect"}
      </button>
      <div style={{ marginTop: 8 }}>readyState: {readyState}</div>
      <div style={{ marginTop: 8 }}>
        <p>received message: </p>
        {/* {messageHistory.current.map((message, index) => (
          <p key={index} style={{ wordWrap: "break-word" }}>
            {message?.data}
          </p>
        ))} */}
      </div>
    </div>
  );
};

export default SocketDemo;
