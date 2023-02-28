import {
  ADD,
  MINUS,
  TOKEN,
  SWITCH,
  CHANGEDESKTOPUSER,
  STARTGAMEUSER,
} from "../types/index";

const INITIAL_STATE = {
  // 0 等待开始，1游戏已开始
  status: 1,
  //是否可以开始游戏 true表示可以
  isGameStart: false,
  //底注
  minimumMoneyId: 3,
  desktopUser: {},
  currentUser: {},
  bigRound: {},
  winUserId: null,
  userPrepare: false,
};

export default function counter(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case CHANGEDESKTOPUSER:
      console.log("dd1--action", action.payload);
      return {
        ...state,
        isGameStart: action.payload.isGameStart,
        status: action.payload.status,
        minimumMoneyId: action.payload.minimumMoneyId,
        desktopUser: action.payload.desktopUser,
        currentUser: action.payload.currentUser,
        bigRound: action.payload.bigRound,
        winUserId: action.payload.winUserId,
        userPrepare: action.payload.userPrepare,
        isCountDownLeave: action.payload.isCountDownLeave,
      };

    case STARTGAMEUSER:
      return {
        ...state,
        isGameStart: action.payload.isGameStart,
        status: action.payload.status,
      };

    default:
      return state;
  }
}
