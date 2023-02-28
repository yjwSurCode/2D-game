import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";

import { changeUserAction } from "../../store/actions";

import { usePersistFn } from "../../hooks/use-advanced";

//{ changeData = (v: any) => {} }
export const SocketDemo = () => {
  const dispatch = useDispatch();

  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState(
    "ws://8.134.97.109:8003/websocket/1"
  ); //ws/8.134.97.109:8003  wss://echo.websocket.org

  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(socketUrl, {
      onOpen: () => console.log("opened"),
      onError: (e) => console.log("aa-error", e),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    });

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("ws://8.134.97.109:8003/websocket/1"),
    []
  );

  const handleClickSendMessage = useCallback(
    () => sendMessage("conn_success-----click test"),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    console.log("ws", lastJsonMessage, lastMessage);
    // setMessageHistory(lastJsonMessage);
    //! 获取数据  const user: UserStatus = useSelector((state: StoreStatus) => state.user);
    const userData = (lastJsonMessage as any)?.data;

    console.log("userData", userData);

    if (userData) {
      const arr = [];
      if (userData.roomPlayerMap) {
        for (let key in userData.roomPlayerMap) {
          arr.push(userData.roomPlayerMap[key]);
        }
      }

      const info = {
        //是否可以开始游戏
        isGameStart: userData.isGameStart,
        // 0 等待开始，1游戏已开始
        status: userData.status,
        // //桌面信息
        desktopUser: arr,
        // //当前玩家信息信息
        currrentUser: userData.currActionPlayer,
        // //场上信息
        bigRound: userData.bigRound,
      };

      dispatch(changeUserAction(info) as any);
    }
  }, [lastMessage, lastJsonMessage]);

  return (
    <div>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>

      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'message'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message: any, idx) => (
          <span key={idx}>{message ? message.data : null}---</span>
        ))}
      </ul> */}
    </div>
  );
};

export default SocketDemo;
