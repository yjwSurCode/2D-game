import { errRes, okRes, Res } from "../interface/index";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useCookies } from "react-cookie";
import cookie from "react-cookies";
import { RunningEnv } from "../core/constants";
import { CM, GameCard, RTArea, RTAreaTreeNode } from "../core/interfaces";
import { useAsyncFn, useAsyncFnWithDefaults } from "../hooks/use-advanced";
import { useLockMemoizedFn } from "../hooks/use-side-effect";
import { useGetState } from "../hooks/use-state";
import backendService from "../services/backend-service";
import { createBEM } from "../utils/class-utils";
import { parseSearchParams } from "../utils/history-utils";
import { createFC } from "../utils/react-utils";
import { Slider, Button, message, Spin, notification, Statistic } from "antd";
import Icon, { ClockCircleOutlined } from "@ant-design/icons";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { StoreStatus, OrderStatus, UserStatus } from "../store/types/index";
import { useUpdateEffect } from "../utils/use-state";
const { Countdown } = Statistic;

// Prompt
import ReactRouterPrompt from "react-router-prompt";

// context
import create, { createStore, useStore } from "zustand";
import StoreContext from "./context";

//redux
import { useDispatch, useSelector } from "react-redux";
import { changeUserAction } from "../store/actions";
import { Provider } from "react-redux";
import configStore from "../store";

// api
import { GameCaseApi } from "../services/game-service";

//png
import discardBtn from "../../public/image/_0044_btn_discard_d.png";
import passBtn from "../../public/image/_0041_btn_pass_p.png";
import bettingBtn from "../../public/image/_0040_btn_betting_d.png";
import anchorImg from "../../public/image/_0011_official_role3.png";
import filedImg from "../../public/image/_0000_center_table.png";
import cradKing from "../../public/image/card/brand_55.png";
import dekstopChip from "../../public/image/_0029_chip_2.png";
import dekstopCard from "../../public/image/_0028_user_3_brand.png";
import strip from "../../public/image/_0023_strip4.png";
import user_avatar from "../../public/image/_0018_user_avatar.png";
import no_user_avatar from "../../public/image/no_user.svg";
import user_level from "../../public/image/_0020_user_Icon_silver.png";
import this_user_level from "../../public/image/_0036_user_Icon_gold.png";

import { GAME_CARD_LIST } from "../core/config";

//components
import CountdownCircleTimer from "../components/Count-down/index";
import SocketDemo from "../components/Websocket/index";

//css
import "./IndexPage.less";
import "antd/dist/reset.css";

//CountUp
import CountUp from "react-countup";

interface User {
  // 0 ???????????????1???????????????
  status: number;
  //???????????????????????? true????????????
  isGameStart: boolean;
  //????????????
  minimumMoneyId: number;
  //??????????????????
  desktopUser: [
    {
      userId: number;
      //0?????????  1?????????  2????????????   3:??????
      status: number;
      handCardList: Array<any>;
      round: {
        // ????????????????????????
        actionRight: string;
        // ????????????
        balance: number;
        // ?????????????????????
        totalRoundQuantity: number;
        //????????????
        roundName: string;
        //?????????????????????
        // quantity: number;
      };
    }
  ];
  //??????????????????---??????????????? data.currActionPlayer
  currentUser: {
    userId: number;
    // 0:?????????1????????? 2:??????
    blind: number;
    // ??????????????? list ???PASS????????????FOLD????????????BET????????????CALL????????????
    actionList: Array<string>;
    // ????????????
    user: any;
  };
  bigRound: {
    //????????????
    currentRound: string;
    //true ?????????????????????
    isRoundDataDisable: boolean;
    //??????????????????
    isGameEnd: boolean;
    //??????????????????
    moneyPond: number;
    //?????????
    publicCardList: any;
    //?????????????????? ???????????????
    playingPlayers: Array<{ blind: number; round: { actionRight: string } }>;
    //???????????????
    currActionPlayer: any;
  };
  // roomId
  id: number;
  //?????????winUserId
  winUserId: number;
  //???????????????????????????
  userPrepare: boolean;
  //
  isCountDownLeave: boolean;
}

const bem = createBEM("index-page");

function handleDispatchUser(v: any) {
  console.log("dd-v", v);
  const arr = [];
  if (v.roomPlayerMap) {
    for (let key in v.roomPlayerMap) {
      arr.push(v.roomPlayerMap[key]);
    }
  }

  const _user = arr.filter(
    (item) => item?.userId == Number(window.localStorage.getItem("userId"))
  );

  return {
    //????????????????????????
    isGameStart: v.isGameStart,
    //??????
    minimumMoneyId: v.minimumMoneyId,
    // 0 ???????????????1???????????????
    status: v.status,
    //??????????????????
    desktopUser: arr,
    //????????????????????????
    currentUser: v.currActionPlayer,
    //????????????
    bigRound: v.bigRound,
    winUserId: v.winUserId,
    //???????????????????????????
    userPrepare: _user[0]?.status
      ? (_user[0]?.status == 1 || _user[0]?.status == 2) == true
        ? true
        : false
      : false,
    //true ?????????????????????????????????
    isCountDownLeave: v.isCountDownLeave,
  };
}

//?????????
function findCardFn(id: number) {
  return GAME_CARD_LIST.filter((item: any) => item.cardId === id);
}

const IndexPage = createFC("IndexPage", (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [api, _contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    winUserId: any,
    status: string
  ) => {
    api.success({
      key: "updatable",
      message: `Game over`,
      description: `The winner is ${winUserId}`,
      duration: 1,
      style: {
        width: 300,
      },
    });
  };

  const user: User = useSelector((state: StoreStatus) => state.user);

  // ?????????
  const [desktopCard, setdesktopCard] = useState<any>([]);
  //time
  const [countCount, setcountCount] = useState<any>(9);
  // loading
  const [pageLoading, setpageLoading] = useState<boolean>(true);
  //??????????????????id
  const [currentUserId, setcurrentUserId] = useState<number>(0);
  //?????? ?????????
  const [quantity, setquantity] = useState<number>(0);
  const [marks, setMarks] = useState<any>({
    1: {
      style: {
        color: "#f50",
      },
      label: <strong>Min</strong>,
    },
    2: `??${2 * user.minimumMoneyId}`,
    4: `??${4 * user.minimumMoneyId}`,
    6: `??${6 * user.minimumMoneyId}`,
    8: `??${8 * user.minimumMoneyId}`,
    10: `??${10 * user.minimumMoneyId}`,
    12: `??${12 * user.minimumMoneyId}`,
    14: `??${14 * user.minimumMoneyId}`,
    16: `??${16 * user.minimumMoneyId}`,
    18: `??${18 * user.minimumMoneyId}`,
    20: {
      style: {
        color: "#f50",
      },
      label: <strong>Max({20 * user.minimumMoneyId})</strong>,
    },
  });
  // ???????????? ?????? ??????   Array<User["desktopUser"]>
  const [userState, setuserState] = useState<Array<User["desktopUser"]>>([]);
  // ????????????????????????
  const [staffInfoListMoney, setstaffInfoListMoney] = useState<any>([
    { totalRoundQuantity: "1", isRoundDataDisable: false },
  ]);
  //????????????????????????PASS????????????FOLD????????????BET????????????CALL????????????
  const [actionBtnList, setActionBtnList] = useState<any>([
    "FOLD",
    "PASS",
    "BET",
    "CALL",
  ]);
  // ?????????????????????
  const [roateCard, setroateCard] = useState<boolean>(false);
  //?????????????????? true????????????
  const [isCountDownLeave, setisCountDownLeave] = useState<boolean>(false);
  const [deadline, setdeadline] = useState<any>(Date.now() + 1000 * 10);

  /*request api*/
  const useAsyncFn_init = useAsyncFnWithDefaults({
    onError: (err) => {
      message.error(`????????????????????????:${(err && err.message) || err}`);
    },
  });

  const onFinish = () => {
    console.log("finished!");
    setpageLoading(true);
    handleLeave(null, "passiveLeave");
  };

  //??????????????????
  const [, { run: handleJoinRoomFn }] = useAsyncFn_init(
    async (): Promise<any> => {
      //! useEffect ???????????? TODO ??????:<React.StrictMode>
      const res = await GameCaseApi.join_room({
        // roomId: window.localStorage.getItem("roomId"),
        playerId: window.localStorage.getItem("userId"),
      });
      return res;
    },
    {
      onSuccess: (data: any) => {
        if (data.code == "047") {
          messageApi.error("Player has joined the room");
          return;
        }
        if (data.code == "027") {
          messageApi.error("User does not exist");
          return;
        }
        if (data.code == "051") {
          messageApi.error("Information does not exist");
          return;
        }
        if (data.code == "-011") {
          messageApi.error("Failed");
          return;
        }

        // ?????? data.body
        const info = handleDispatchUser(data.body);

        //??????????????????
        setuserState(info.desktopUser);
        //???????????????????????????
        setActionBtnList(info?.currentUser?.actionList);
        //??????user
        dispatch(changeUserAction(info) as any);
        //????????????id
        window.localStorage.setItem("roomId", data.body.id);

        //????????????
        // if(info)

        //loading
        setpageLoading(false);
      },
      cacheData: false,
    }
  );

  //????????????
  const [, { run: handleRefrash }] = useAsyncFn(
    async (): Promise<any> => {
      const res = await GameCaseApi.refresh_page({
        roomId: Number(window.localStorage.getItem("roomId")) || 1,
      });
      return res;
    },
    {
      onSuccess: (data: any) => {
        if (data.code == "051") {
          messageApi.error("Information does not exist");
          return;
        }

        // ?????? data.body
        const info = handleDispatchUser(data.body);
        //??????????????????
        setuserState(info.desktopUser);
        //??????user
        dispatch(changeUserAction(info) as any);
        //loading
        setpageLoading(false);
      },
    }
  );

  //??????????????????
  const [, { run: handleLeaveRoom }] = useAsyncFn(
    async (): Promise<any> => {
      if (!window.localStorage.getItem("userId")) {
        messageApi.error("no userId");
        return;
      }

      const res = await GameCaseApi.leave_room({
        playerId: window.localStorage.getItem("userId"),
        roomId: window.localStorage.getItem("roomId"),
      });
      return res;
    },
    {
      onSuccess: (data: any) => {},
    }
  );

  //????????????
  const [, { run: handlePrepare }] = useAsyncFn(
    async (): Promise<any> => {
      if (!window.localStorage.getItem("userId")) {
        messageApi.error("no userId");
        return;
      }
      if (!window.localStorage.getItem("roomId")) {
        messageApi.error("no roomId");
        return;
      }

      const res = await GameCaseApi.user_prepare({
        playerId: Number(window.localStorage.getItem("userId")),
        roomId: Number(window.localStorage.getItem("roomId")),
        isPlayerReady: true,
      });
      return res;
    },
    {
      onSuccess: (data: any) => {
        //! ????????????????????? ????????????????????????
        console.log("ee-data.msg", data.msg);
        if (data.msg === "success") {
          // setisCountDownLeave(false);
        }
        // ?????? data.body
        const info = handleDispatchUser(data.body);
        //??????user
        dispatch(changeUserAction(info) as any);
      },
    }
  );

  //????????????
  const [, { run: handleStartGame }] = useAsyncFn(
    async (): Promise<any> => {
      const res = await GameCaseApi.start_game({
        roomId: Number(window.localStorage.getItem("roomId")),
      });
      return res;
    },
    {
      onSuccess: (data: any) => {
        if (data.code == "060") {
          messageApi.error("The player's chips are insufficient to bet");
          setpageLoading(false);
          return;
        }
        if (data.body?.bigRound?.publicCardList) {
          setdesktopCard(data.body.bigRound.publicCardList);
        }
        setpageLoading(false);

        //! ?????????????????????
        // const info = handleDispatchUser(data.body);
        // dispatch(changeUserAction(info) as any);
      },
    }
  );

  //????????????
  const [, { run: handleOverGame }] = useAsyncFn(
    async (): Promise<any> => {
      const res = await GameCaseApi.over_game({
        roomId: Number(window.localStorage.getItem("roomId")),
      });
      return res;
    },
    {
      onSuccess: (data: any) => {
        setcountCount(9);
        // !?????????????????????
        console.log("game over", data);
        if (data.code == "-011") {
          message.error("action failed");
          return;
        }
      },
    }
  );

  //????????????FN
  const [, { run: handleBettingFn }] = useAsyncFn(
    async (action: string, evt: any): Promise<any> => {
      console.log("aa-quantity", quantity, action, evt);
      //PASS????????????????????????????????????
      if (action == "PASS") {
        const res = await GameCaseApi.betting({
          roomId: window.localStorage.getItem("roomId"),
          playerId: window.localStorage.getItem("userId"),
          // quantity: quantity,
          action: "PASS",
        });

        return { ...res, evt, action: "PASS" };
      }
      //???????????? ????????????
      if (action == "FOLD") {
        const res = await GameCaseApi.betting({
          roomId: window.localStorage.getItem("roomId"),
          playerId: window.localStorage.getItem("userId"),
          // quantity: quantity,
          action: "FOLD",
        });

        return { ...res, evt, action: "FOLD" };
      }

      if (action == "CALL") {
        const res = await GameCaseApi.betting({
          roomId: window.localStorage.getItem("roomId"),
          playerId: window.localStorage.getItem("userId"),
          // quantity: quantity,
          action: "CALL",
        });

        return { ...res, evt, action: "CALL" };
      }

      if (!quantity || quantity < 1) {
        messageApi.error("Please select the bet amount");
        return { msg: "no_amount" };
      }

      const res = await GameCaseApi.betting({
        roomId: window.localStorage.getItem("roomId"),
        playerId: window.localStorage.getItem("userId"),
        quantity: quantity,
        action: action,
      });

      return { ...res, evt, action: "BET" };
    },
    {
      onSuccess: (data: any) => {
        if (data.msg == "no_amount") {
          return;
        }
        if (data.code == "-011") {
          messageApi.error("action failed");
          return;
        }
        if (data.code == "052") {
          messageApi.error("This user is not the current operational user");
          return;
        }
        if (data.code == "060") {
          messageApi.error("The player's chips are insufficient to bet");
          return;
        }
        if (data.code == "059") {
          messageApi.error(
            "The bet cannot be less than the bet of other players"
          );
          return;
        }

        console.log("dd-action-data", data);

        if (data.msg == "success") {
          messageApi.success("Operation success");

          //! ????????????&&????????????
          if (data.action == "FOLD" && data.body.bigRound.isGameEnd) {
            setcountCount(0);
          }

          //????????????
          if (data.action == "CALL" || data.action == "BET") {
            BettingTransion(data.evt);
          }

          if (data.body.bigRound.isGameEnd) {
            //!????????????????????????
            handleOverGame();
            return;
          } else {
            //! ???????????????????????????
            setcountCount(9);

            //??????????????????????????????
            setTimeout(() => {
              const info = handleDispatchUser(data.body);
              //??????user
              dispatch(changeUserAction(info) as any);
            }, 500);
          }
        }
      },
      cacheData: true,
    }
  );

  //??????????????????1
  const handleBetting = (evt: any, item: string) => {
    if (item === "PASS") {
      handleBettingFn("PASS", evt);
      return;
    }
    if (item === "FOLD") {
      handleBettingFn("FOLD", evt);
      return;
    }
    if (item === "BET") {
      handleBettingFn("BET", evt);
      return;
    }
    if (item === "CALL") {
      handleBettingFn("CALL", evt);
      return;
    }
  };

  // ????????????
  const handleLeave = (onConfirm?: any, type?: string) => {
    console.log("ee-handleLeave", onConfirm, type);
    handleLeaveRoom().then((e) => {
      if (e.msg === "success") {
        // return
        setdeadline(0);
        if (type === "passiveLeave") {
          setisCountDownLeave(true);
          setpageLoading(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
          return;
        }
        if (type === "refreshLeave") {
          setisCountDownLeave(true);
          setpageLoading(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
          return;
        }
      } else {
        if (e.code == "054") {
          setisCountDownLeave(true);
          setpageLoading(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
          return;
        }
        setTimeout(() => {
          message.error("ERROR:failed to leave");
        }, 1000);
      }
    });
    if (typeof onConfirm == "function") onConfirm && onConfirm();
  };

  //????????????
  const onComplete = () => {
    console.log(
      "????????????",
      user?.currentUser?.userId ===
        Number(window.localStorage.getItem("userId"))
    );
    //! ?????????????????????????????????
    if (
      user?.currentUser?.userId ===
      Number(window.localStorage.getItem("userId"))
    ) {
      handleBettingFn("FOLD", 0);
    }
  };

  // ????????????????????????
  const handleSlider = (v: any) => {
    const _v = v === 0 ? 1 : v;
    messageApi.info(`The selected amount is ${_v * user.minimumMoneyId}`);
    setquantity(_v * user.minimumMoneyId);
  };

  //????????????
  const BettingTransion = (evt: any) => {
    console.log("evt", evt);
    var $ball = document.getElementById("ball");
    ($ball as any).style.display = "block";
    if (!$ball) {
      return;
    }
    $ball.style.top = evt.pageY + "px";
    $ball.style.left = evt.pageX + "px";
    $ball.style.transition = "left 0s, top 0s";
    setTimeout(() => {
      // $ball.style.top = window.innerHeight+'px';
      ($ball as any).style.top = "48px";
      ($ball as any).style.left = "56.25rem";
      ($ball as any).style.transition = "left 1s linear, top 1s ease-in";
    }, 20);

    setTimeout(() => {
      ($ball as any).style.display = "none";
    }, 1020);
  };

  // ??????,????????????
  const renderActionBtn = () => {
    return (
      <>
        {/* //! ???????????????????????? */}
        {user.userPrepare ? (
          Number(window.localStorage.getItem("userId")) ===
          user.currentUser?.userId ? (
            <div className={bem("action-box")}>
              {Array.isArray(actionBtnList) &&
                actionBtnList.map((item: any, index: number) => (
                  <div
                    className={bem("action-box-img")}
                    onClick={(evt) => handleBetting(evt, item)}
                    key={index}
                  >
                    <span>{item}</span>
                    {item === "FOLD" && <img src={discardBtn} alt="" />}
                    {item === "PASS" && <img src={passBtn} alt="" />}
                    {item === "BET" && <img src={bettingBtn} alt="" />}
                    {item === "CALL" && <img src={bettingBtn} alt="" />}
                  </div>
                ))}
            </div>
          ) : (
            <div>
              <div className={bem("action-box")}>Please wait for your turn</div>
            </div>
          )
        ) : (
          <div
            onClick={handlePrepare}
            className="index-page__action-box-img prepareBtn"
          >
            <span>Prepare</span>
            <img src={discardBtn} alt="" />
          </div>
        )}
        {}
      </>
    );
  };

  // ????????????????????????
  const renderMoneyProcress = () => {
    return (
      <div
        className="money-progress"
        style={{
          display: "inline-block",
          height: 400,
          marginLeft: 70,
          position: "absolute",
          right: 0,
          top: "20%",
          zIndex: 99,
          backgroundColor: "#f6ecd0",
          borderRadius: "10px",
          padding: "41px 65px 41px 10px",
          // maxWidth:'80px'
        }}
      >
        <Slider
          vertical
          prefixCls="www"
          max={20}
          marks={marks}
          dots={true}
          step={5}
          tooltip={{ open: false, prefixCls: "00" }}
          defaultValue={0}
          onAfterChange={handleSlider}
        />
      </div>
    );
  };

  //??????
  const renderField = () => {
    return (
      <div className={bem("field-panle")}>
        {/* ????????? */}
        <div className="anchor-img">
          <img src={anchorImg} alt="" />
        </div>

        {/* ?????? */}
        <div className="field-center">
          <img src={filedImg} alt="" />

          {/* ?????? */}
          <div className="staff-box-six">
            {Array.isArray(userState) &&
              userState.map((item: any, index: number) => {
                //????????????
                const handleDemo = () => {
                  switch (item?.status) {
                    case 0:
                      return "Await";
                      break;
                    case 1:
                      return "Prepared";
                      break;
                    case 2:
                      return "Gaming";
                      break;
                    case 3:
                      return "Fold";
                      break;
                    default:
                    //  ??????n?????????1?????????2?????????????????????
                  }
                };
                return (
                  <div key={index} className="sigle-staff">
                    {item == null ? (
                      <img
                        className="sigle-staff-avatar"
                        src={no_user_avatar}
                        alt=""
                      />
                    ) : item?.status === 2 ? (
                      <div className="sigle-staff-avatarStatus">
                        <span
                          className="span-userStatus"
                          style={{
                            animation: "flipInX",
                            animationDuration: "2s",
                          }}
                        >
                          {handleDemo()}
                        </span>
                        <img
                          className="sigle-staff-avatar"
                          src={user_avatar}
                          style={
                            currentUserId == item.userId
                              ? {
                                  boxShadow: "0px 0px 10px 10px #e5bd38",
                                }
                              : {}
                          }
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="sigle-staff-avatarStatus">
                        <div className="antdCountDown">
                          {/* //????????????????????? */}
                          {item.status == 0 &&
                            Number(
                              window.localStorage.getItem("userId") ==
                                item.userId
                            ) &&
                            item.userId && (
                              <Countdown
                                title="Countdown"
                                value={deadline}
                                prefix={
                                  <div>
                                    <ClockCircleOutlined></ClockCircleOutlined>
                                    <span>Please prepare</span>
                                  </div>
                                }
                                format="s"
                                onFinish={onFinish}
                              />
                            )}
                        </div>

                        <span
                          className="span-userStatus"
                          style={{
                            animation: "flipInX",
                            animationDuration: "2s",
                          }}
                        >
                          {handleDemo()}
                        </span>
                        <img
                          className="sigle-staff-avatar"
                          src={user_avatar}
                          style={{ opacity: 0.9 }}
                          alt=""
                        />
                      </div>
                    )}

                    {/* //! react-countdown-clock */}
                    {item == null ? (
                      <div style={{ position: "absolute" }}>
                        666...{item?.status}...
                      </div>
                    ) : //
                    //! ??????????????????????????????????????? user?.bigRound?.playingPlayers.map((item: any) => item.userId).includes( Number(window.localStorage.getItem("userId")))
                    Array.isArray(user?.bigRound?.playingPlayers) &&
                      user?.bigRound?.playingPlayers
                        .map((item: any) => item.userId)
                        .includes(
                          Number(window.localStorage.getItem("userId"))
                        ) ? (
                      //! ?????????????????????????????????&&???????????????
                      item.userId ===
                        Number(window.localStorage.getItem("userId")) &&
                      currentUserId === item.userId &&
                      user.isGameStart === true &&
                      user.status === 1 && (
                        <CountdownCircleTimer
                          style={{ top: "-65px" }}
                          onComplete={onComplete}
                          countCount={countCount}
                          className="CountdownCircleTimer"
                        ></CountdownCircleTimer>
                      )
                    ) : (
                      <div className="antdCountDown">
                        666
                        {/* <Countdown
                          title="Countdown"
                          value={deadline}
                          prefix="?????????"
                          format="s"
                          onFinish={onFinish}
                        /> */}
                      </div>
                    )}
                    {/* <div style={{ zIndex: 999, color: "white" }}>
                      ?????????????????????{user?.currentUser?.userId}---- ???????????????
                      {item && item.userId}---- ?????????
                      {item && item.blind}
                    </div> */}
                    <div className="content">
                      {/* //!???????????????????????????????????? item?.round?.actionRight==null */}
                      <div
                        className="sigle-staff-state"
                        style={
                          item?.round?.actionRight == "FOLD"
                            ? { color: "red" }
                            : {}
                        }
                      >
                        {item == null
                          ? "No user"
                          : item?.round?.actionRight
                          ? item?.round?.actionRight
                          : "No-start"}
                      </div>
                      <div className="flexContent">
                        {/* //! ?????????????????????????????? */}
                        {item?.userId ==
                        Number(window.localStorage.getItem("userId")) ? (
                          <img
                            className="sigle-staff-level"
                            src={this_user_level}
                            alt=""
                          />
                        ) : (
                          <img
                            className="sigle-staff-level"
                            src={user_level}
                            alt=""
                          />
                        )}
                        <span className="sigle-staff-money">
                          {/* //! ??????????????? */}
                          {item
                            ? item?.round?.balance
                              ? item?.round?.balance
                              : item?.user?.preQuantity
                            : "No user"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ??????????????????+?????? //! react-animated-numbers ?????????????????? */}
          <div className="staff-box-six-chip">
            {staffInfoListMoney.map((item: any, index: number) => {
              return (
                <div key={index} className="sigle-staff">
                  <div className="content">
                    <div className="flexContent">
                      <div className="flexContent-div">
                        {index != 6 && <img src={dekstopCard} alt="" />}
                        <img
                          className="sigle-staff-level"
                          src={dekstopChip}
                          alt=""
                        />
                      </div>
                      {/* //!??????????????? */}
                      {item?.totalRoundQuantity ? (
                        user?.bigRound?.isRoundDataDisable && index != 6 ? (
                          <div
                            className="sigle-staff-money"
                            style={{
                              animation: "fadeOutUp",
                              animationDuration: "2s",
                              animationDelay: "1s",
                              animationIterationCount: 1,
                              animationFillMode: "forwards",
                            }}
                          >
                            {/* {index === 6 && <span>Total &nbsp;</span>} */}
                            <span style={index === 6 ? { color: "red" } : {}}>
                              {/* moneyPond ????????????????????????????????? */}
                              {index === 6
                                ? user?.bigRound?.moneyPond
                                : item?.totalRoundQuantity}
                              {/* <CountUp
                                end={
                                  index === 6
                                    ? user?.bigRound?.moneyPond
                                    : item?.totalRoundQuantity
                                }
                              ></CountUp> */}
                            </span>
                          </div>
                        ) : (
                          <div className="sigle-staff-money">
                            <span style={index === 6 ? { color: "red" } : {}}>
                              {index === 6
                                ? user?.bigRound?.moneyPond
                                : item?.totalRoundQuantity}
                            </span>
                          </div>
                        )
                      ) : (
                        <div>666</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ????????? bigRound.publicCardList */}
          <div className="desktop-card">
            {desktopCard?.map((item: any, index: number) => {
              const curImg: any = findCardFn(item?.playingCardId);
              console.log(curImg, "dd-curImg", curImg.imageURL);
              return (
                <span key={index} className="desktop-card-box">
                  {item == null ? (
                    <img
                      style={{
                        animation: "flipInY",
                        animationDuration: "1.5s",
                      }}
                      className="desktop-card-img"
                      src={cradKing}
                      alt=""
                    />
                  ) : (
                    <img
                      style={{
                        animation: "flipInY",
                        animationDuration: "1.5s",
                      }}
                      // bigRoundId	1798
                      // createTime	1673486187448
                      // detail	"??????4"
                      // id	68
                      // number	4
                      // playingCardId	29
                      // suit	2
                      className="desktop-card-img"
                      // src={item.visible ? item.img : cradKing}
                      // src={curImg.imageURL ? curImg.imageURL : cradKing}
                      src={curImg[0].imageURL}
                      alt=""
                    />
                  )}
                </span>
              );
            })}
          </div>

          {/* ????????? */}
          <div className="current-card">
            {/* //! ???????????????????????? */}
            {user.status == 1 ? (
              <>
                <img src={strip} className="stripImg" alt="" />
                <ul
                  id="fan-out"
                  onClick={() => setroateCard(!roateCard)}
                  className={roateCard ? "" : "active"}
                >
                  {/* //! userState????????????????????????????????? */}
                  {(userState ? userState : []).map(
                    (item: any, index: number) =>
                      (item && item?.userId) ===
                      Number(window.localStorage.getItem("userId")) ? (
                        <div key={index}>
                          {(item && item?.handCardList
                            ? item && item?.handCardList
                            : []
                          ).map((_item: any, _index: number) => {
                            const curImg: any = findCardFn(
                              _item?.playingCardId
                            );
                            console.log(
                              _item,
                              "dd-curImg2",
                              curImg[0].imageURL
                            );
                            return (
                              <li
                                className="fan-card"
                                style={{
                                  background: `url(${curImg[0].imageURL})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "contain",
                                }}
                                key={_index}
                              >
                                {_item ? _item?.detail : "666"}
                              </li>
                            );
                          })}
                        </div>
                      ) : (
                        <div key={index}>666</div>
                      )
                  )}
                </ul>
              </>
            ) : (
              "666"
            )}
          </div>

          {/* ???????????? */}
          <div id="ball">
            <img src={dekstopChip} alt="" />
          </div>
        </div>
      </div>
    );
  };

  // ???????????? ??????
  const handleUpdateState = (v: any) => {
    return;
    //??????????????????
    // if (user.desktopUser) {
    //   setuserState(user.desktopUser);
    // }
  };

  // zustand
  const useStore = create((set) => ({
    count: 1,
    user: {},
    changUserData: (v: any) => set((state: any) => ({ user: v })),
  }));

  useEffect(() => {
    if (!cookie.load("expiresTime")) {
      //????????????
      console.log("aa-????????????");
      handleLeave(null, "refreshLeave");
      return;
    } else {
      //??????????????????
      console.log("aa-??????????????????");
      handleJoinRoomFn();
      // handleJoinRoom();
      return;
    }
  }, []);

  useUpdateEffect(() => {
    console.log(
      "dd--user",
      user,
      "????????????",
      user.isGameStart === true && user.status === 0,
      "????????????",
      user?.bigRound?.isGameEnd,
      "????????????????????????",
      user?.currentUser,
      "?????????????????????",
      user?.isCountDownLeave == true
    );

    if (user.winUserId) {
      openNotification("topRight", user.winUserId, "success");
    }

    // ??????????????????
    if (user?.bigRound?.isGameEnd) {
      handleOverGame();
      return;
    }

    // if (user?.isCountDownLeave == true) {
    //   setisCountDownLeave(true);
    // }
    // !??????????????????????????????  ?????????????????????????????????????????????
    if (!user.desktopUser || !user.minimumMoneyId) {
      messageApi.error("Some fields are missing");
    }

    // ????????????????????????id
    if (user.currentUser) {
      if (user.currentUser.userId) {
        setcurrentUserId(user.currentUser.userId);
      }
    } else {
      // message.error("No currentUser");
      console.log("No currentUser");
    }

    //???????????????
    setdesktopCard([]);
    setTimeout(() => {
      setdesktopCard(user?.bigRound?.publicCardList);
    }, 10);

    //??????????????????
    if (user.desktopUser) {
      setuserState(user.desktopUser as Array<any>);
      // if (
      //   user.desktopUser.filter(
      //     (item) =>
      //       item?.userId === Number(window.localStorage.getItem("userId"))
      //   ).length === 0
      // ) {
      //   //???????????????
      //   setisCountDownLeave(false);

      //   setTimeout(() => {
      //     handleLeave(null, "passiveLeave");
      //   }, 1000);
      // }
    }

    //??????????????????????????? ????????????????????????
    const userQuantity = user.desktopUser.map((item) =>
      item
        ? {
            totalRoundQuantity: item?.round?.totalRoundQuantity,
          }
        : null
    );
    setstaffInfoListMoney([
      ...userQuantity,
      { totalRoundQuantity: user?.bigRound?.moneyPond },
    ]);

    //???????????????????????????
    setActionBtnList(user?.currentUser?.actionList);

    //????????????????????????
    const marks = {
      0: {
        style: {
          color: "#f50",
        },
        label: <strong>Min({user.minimumMoneyId})</strong>,
      },
      2: `??${2 * user.minimumMoneyId}`,
      4: `??${4 * user.minimumMoneyId}`,
      6: `??${6 * user.minimumMoneyId}`,
      8: `??${8 * user.minimumMoneyId}`,
      10: `??${10 * user.minimumMoneyId}`,
      12: `??${12 * user.minimumMoneyId}`,
      14: `??${14 * user.minimumMoneyId}`,
      16: `??${16 * user.minimumMoneyId}`,
      18: `??${18 * user.minimumMoneyId}`,
      20: {
        style: {
          color: "#f50",
        },
        label: <strong>Max({20 * user.minimumMoneyId})</strong>,
      },
    };
    setMarks(marks);

    // !???????????? TODO------????????????????????????????????????user
    //??????????????????
    if (user.isGameStart === true && user.status === 0) {
      message.info("START GAME");
      setpageLoading(true);
      setTimeout(() => {
        handleStartGame();
      }, 500);
      return;
    }
  }, [user]);

  const store = configStore();

  return (
    <main className={bem()}>
      <Spin
        tip="Loading..."
        className="spinbox"
        size="large"
        spinning={pageLoading}
        delay={100}
      >
        <div>{contextHolder}</div>
        <div>{_contextHolder}</div>
        {renderField()}
        {renderMoneyProcress()}
        <div className={bem("panle")}>{renderActionBtn()}</div>
      </Spin>
      <SocketDemo updateState={handleUpdateState}></SocketDemo>
      {/* false ?????????????????? */}
      {/* {isCountDownLeave === false && ( */}
      <ReactRouterPrompt when={!isCountDownLeave}>
        {({ isActive, onConfirm, onCancel }) =>
          isActive && (
            <div className="prompt-box">
              <div className="container">
                <p>Do you really want to leave?</p>
                <div className="container-btn">
                  <Button className="btn" type="primary" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    className="btn"
                    type="primary"
                    onClick={() => handleLeave(onConfirm)}
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      </ReactRouterPrompt>
      {/* )} */}
    </main>
  );
});

export default IndexPage;
