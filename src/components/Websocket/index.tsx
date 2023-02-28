import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";
import { changeUserAction } from "../../store/actions";

import { useUpdateEffect } from "../../utils/use-state";

export const SocketDemo = ({ updateState }: any) => {
  const dispatch = useDispatch();
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState(
    `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem("userId")}`
  );
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(socketUrl, {
      onOpen: () => console.log("opened"),
      onError: (err) => {
        console.log("aa-error");
        // alert(err);
        // message.error(`无法连接到服务器:${(err && err.message) || err}`);
      },
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    });

  useUpdateEffect(() => {
    console.log("ws", lastMessage, lastJsonMessage);
    // if (lastMessage !== null) {
    //   setMessageHistory((prev) => (prev as any).concat(lastMessage));
    // }

    const userData = (lastJsonMessage as any)?.data;

    if (userData) {
      const arr = [];
      if (userData.roomPlayerMap) {
        for (let key in userData.roomPlayerMap) {
          arr.push(userData.roomPlayerMap[key]);
        }
      }

      const _user = arr.filter(
        (item) => item?.userId == Number(window.localStorage.getItem("userId"))
      );

      const info = {
        //是否可以开始游戏
        isGameStart: userData.isGameStart,
        // 0 等待开始，1游戏已开始
        status: userData.status,
        //桌面信息
        desktopUser: arr,
        //当前玩家信息信息
        currentUser: userData.currActionPlayer,
        bigRound: userData.bigRound,
        winUserId: userData.winUserId,
        minimumMoneyId: userData.minimumMoneyId,
        //此电脑用户是否准备
        userPrepare:
          (_user[0].status == 1 || _user[0].status == 2) == true ? true : false,
        isCountDownLeave: userData.isCountDownLeave,
      };

      console.log("ee-userData", info);

      dispatch(changeUserAction(info) as any);

      //触发父组件函数  需要优化加
      // updateState("1");
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () =>
      setSocketUrl(
        `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem(
          "userId"
        )}`
      ),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      {/* <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message: any, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul> */}
    </div>
  );
};

export default SocketDemo;

// import React, { useRef, useMemo, useEffect } from "react";
// import { useWebSocket } from "ahooks";

// enum ReadyState {
//   Connecting = 0,
//   Open = 1,
//   Closing = 2,
//   Closed = 3,
// }

// export const SocketDemo = () => {
//   console.log(
//     "init",
//     `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem("userId")}`
//   );
//   const messageHistory = useRef<any[]>([]);

//   const { readyState, sendMessage, latestMessage, disconnect, connect } =
//     useWebSocket(
//       "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self",
//       // `ws://8.134.97.109:8003/websocket/${window.localStorage.getItem(
//       //   "userId"
//       // )}`,
//       // {
//       //   onOpen: () => console.log("opened"),
//       //   onError: (e) => console.log("aa-error", e),
//       // }
//     );

//   // messageHistory.current = useMemo(
//   //   () => messageHistory.current.concat(latestMessage),
//   //   [latestMessage]
//   // );

//   useEffect(() => {
//     console.log("ws", latestMessage, readyState);
//     if (readyState === 1) {
//       disconnect && disconnect();
//     }
//   }, []);

//   return (
//     <div>
//       {/* send message */}
//       <button
//         onClick={() => sendMessage && sendMessage("66666")}
//         disabled={readyState !== ReadyState.Open}
//         style={{ marginRight: 8 }}
//       >
//         ✉️ send
//       </button>
//       {/* disconnect */}
//       <button
//         onClick={() => {
//           console.log("disconnect");
//           disconnect && disconnect();
//         }}
//         disabled={readyState !== ReadyState.Open}
//         style={{ marginRight: 8 }}
//       >
//         ❌ disconnect
//       </button>
//       {/* connect */}
//       <button
//         onClick={() => connect && connect()}
//         disabled={readyState === ReadyState.Open}
//       >
//         {readyState === ReadyState.Connecting ? "connecting" : "📞 connect"}
//       </button>
//       <div style={{ marginTop: 8 }}>readyState: {readyState}</div>
//       <div style={{ marginTop: 8 }}>
//         <p>received message: </p>
//         {/* {messageHistory.current.map((message, index) => (
//           <p key={index} style={{ wordWrap: "break-word" }}>
//             {message?.data}
//           </p>
//         ))} */}
//       </div>
//     </div>
//   );
// };

// export default SocketDemo;
