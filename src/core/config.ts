import { ProjectEnv } from "./constants";
import { GameCard, ProjectPaths } from "./interfaces";
import abi from "../../public/Transactions.json";

export const IS_DEV_MODE: boolean = __PROJECT__.IS_DEV;

export const PROJECT_ENV: ProjectEnv = __PROJECT__.ENV || ProjectEnv.Online;

export const PROJECT_PUBLIC_PATH: string = __PROJECT__.PUBLIC_PATH;

export const PROJECT_ROUTE_BASE: string = __PROJECT__.ROUTE_BASE;

export const PROJECT_PATHS: ProjectPaths = ((env: ProjectEnv): ProjectPaths => {
  if (IS_DEV_MODE) {
    return {
      project: "/backend-api", //"http://8.134.97.109:8003", // "http://localhost:3000",
      backend: "/mock-api",
      // backend: 'http://cms-draw-api.beta1.fn',
      cmsSale: "http://cms-yx.beta1.fn",
      flume: "http://track01.beta1.fn",
    };
  }

  switch (env) {
    case ProjectEnv.Dev:
    case ProjectEnv.Beta:
      return {
        project: "http://rt-fe-web.beta1.fn",
        backend: "http://cms-draw-api.beta1.fn",
        cmsSale: "http://cms-yx.beta1.fn",
        flume: "http://track01.beta1.fn",
      };

    case ProjectEnv.Preview:
      return {
        project: "https://preview-rt-fe-web.feiniu.com",
        backend: "https://draw-preview.feiniu.com",
        cmsSale: "https://yxsale-preview.feiniu.com",
        flume: "https://flume.feiniu.com",
      };

    default:
      return {
        project: "http://8.134.97.109:8003",
        backend: "https://draw.feiniu.com",
        cmsSale: "https://yxsale.feiniu.com",
        flume: "https://flume.feiniu.com",
      };
  }
})(PROJECT_ENV);

export const GAME_CMS_AID = "yx_claw";

//我的地址
export const contractAddress = "0xc66322e0da931889CFF7947212f9A3131b3C9018";
export const contractABI = abi.abi;

import spade7 from "../../public/image/card/brand_02.png";
import block7 from "../../public/image/card/brand_04.png";
import spade6 from "../../public/image/card/brand_05.png";
import heart6 from "../../public/image/card/brand_06.png";
import plum6 from "../../public/image/card/brand_07.png";
import spade9 from "../../public/image/card/brand_10.png";
import heart7 from "../../public/image/card/brand_11.png";
import plum7 from "../../public/image/card/brand_12.png";
import block6 from "../../public/image/card/brand_13.png";
import plum4 from "../../public/image/card/brand_14.png";
import block4 from "../../public/image/card/brand_15.png";
import spade3 from "../../public/image/card/brand_16.png";
import heart3 from "../../public/image/card/brand_17.png";
import plum3 from "../../public/image/card/brand_18.png";
import block3 from "../../public/image/card/brand_19.png";
import spade2 from "../../public/image/card/brand_20.png";
import heart9 from "../../public/image/card/brand_22.png";
import heart2 from "../../public/image/card/brand_23.png";
import plum2 from "../../public/image/card/brand_24.png";
import block2 from "../../public/image/card/brand_25.png";
import spade1 from "../../public/image/card/brand_26.png";
import spade13 from "../../public/image/card/brand_27.png";
import heart13 from "../../public/image/card/brand_28.png";
import spade5 from "../../public/image/card/brand_29.png";
import plum13 from "../../public/image/card/brand_30.png";
import plum9 from "../../public/image/card/brand_31.png";
import block12 from "../../public/image/card/brand_33.png";
import plum1 from "../../public/image/card/brand_34.png";
import spade11 from "../../public/image/card/brand_35.png";
import heart11 from "../../public/image/card/brand_36.png";
import plum11 from "../../public/image/card/brand_37.png";
import heart5 from "../../public/image/card/brand_39.png";
import block13 from "../../public/image/card/brand_40.png";
import block11 from "../../public/image/card/brand_41.png";
import block9 from "../../public/image/card/brand_43.png";
import block1 from "../../public/image/card/brand_44.png";
import card45 from "../../public/image/card/brand_45.png";
import plum5 from "../../public/image/card/brand_47.png";
import heart1 from "../../public/image/card/brand_48.png";
import spade8 from "../../public/image/card/brand_49.png";
import spade10 from "../../public/image/card/brand_50.png";
import block5 from "../../public/image/card/brand_52.png";
import spade12 from "../../public/image/card/brand_53.png";
import card55 from "../../public/image/card/brand_55.png";
import heart8 from "../../public/image/card/brand_57.png";
import heart10 from "../../public/image/card/brand_58.png";
import spade4 from "../../public/image/card/brand_59.png";
import heart12 from "../../public/image/card/brand_60.png";
import plum8 from "../../public/image/card/brand_62.png";
import plum10 from "../../public/image/card/brand_63.png";
import heart4 from "../../public/image/card/brand_64.png";
import plum12 from "../../public/image/card/brand_65.png";
import block8 from "../../public/image/card/brand_66.png";
import block10 from "../../public/image/card/brand_67.png";

export const GAME_CARD_LIST: GameCard[] = [
  { cardId: 1, decor: 5, num: 7, name: "黑桃2", imageURL: spade2 },
  { cardId: 2, decor: 5, num: 7, name: "黑桃3", imageURL: spade3 },
  { cardId: 3, decor: 5, num: 7, name: "黑桃4", imageURL: spade4 },
  { cardId: 4, decor: 5, num: 7, name: "黑桃5", imageURL: spade5 },
  { cardId: 5, decor: 5, num: 7, name: "黑桃6", imageURL: spade6 },
  { cardId: 6, decor: 5, num: 7, name: "黑桃7", imageURL: spade7 },
  { cardId: 7, decor: 5, num: 7, name: "黑桃8", imageURL: spade8 },
  { cardId: 8, decor: 5, num: 7, name: "黑桃9", imageURL: spade9 },
  { cardId: 9, decor: 5, num: 7, name: "黑桃10", imageURL: spade10 },
  { cardId: 10, decor: 5, num: 7, name: "黑桃J", imageURL: spade11 },
  { cardId: 11, decor: 5, num: 7, name: "黑桃Q", imageURL: spade12 },
  { cardId: 12, decor: 5, num: 7, name: "黑桃K", imageURL: spade13 },
  { cardId: 13, decor: 5, num: 7, name: "黑桃A", imageURL: spade1 },

  { cardId: 14, decor: 5, num: 7, name: "红桃2", imageURL: heart2 },
  { cardId: 15, decor: 5, num: 7, name: "红桃3", imageURL: heart3 },
  { cardId: 16, decor: 5, num: 7, name: "红桃4", imageURL: heart4 },
  { cardId: 17, decor: 5, num: 7, name: "红桃5", imageURL: heart5 },
  { cardId: 18, decor: 5, num: 7, name: "红桃6", imageURL: heart6 },
  { cardId: 19, decor: 5, num: 7, name: "红桃7", imageURL: heart7 },
  { cardId: 20, decor: 5, num: 7, name: "红桃8", imageURL: heart8 },
  { cardId: 21, decor: 5, num: 7, name: "红桃9", imageURL: heart9 },
  { cardId: 22, decor: 5, num: 7, name: "红桃10", imageURL: heart10 },
  { cardId: 23, decor: 5, num: 7, name: "红桃J", imageURL: heart11 },
  { cardId: 24, decor: 5, num: 7, name: "红桃Q", imageURL: heart12 },
  { cardId: 25, decor: 5, num: 7, name: "红桃K", imageURL: heart13 },
  { cardId: 26, decor: 5, num: 7, name: "红桃A", imageURL: heart11 },

  { cardId: 27, decor: 5, num: 7, name: "方块2", imageURL: block2 },
  { cardId: 28, decor: 5, num: 7, name: "方块3", imageURL: block3 },
  { cardId: 29, decor: 5, num: 7, name: "方块4", imageURL: block4 },
  { cardId: 30, decor: 5, num: 7, name: "方块5", imageURL: block5 },
  { cardId: 31, decor: 5, num: 7, name: "方块6", imageURL: block6 },
  { cardId: 32, decor: 5, num: 7, name: "方块7", imageURL: block7 },
  { cardId: 33, decor: 5, num: 7, name: "方块8", imageURL: block8 },
  { cardId: 34, decor: 5, num: 7, name: "方块9", imageURL: block9 },
  { cardId: 35, decor: 5, num: 7, name: "方块10", imageURL: block10 },
  { cardId: 36, decor: 5, num: 7, name: "方块J", imageURL: block11 },
  { cardId: 37, decor: 5, num: 7, name: "方块Q", imageURL: block12 },
  { cardId: 38, decor: 5, num: 7, name: "方块K", imageURL: block13 },
  { cardId: 39, decor: 5, num: 7, name: "方块A", imageURL: block1 },

  { cardId: 40, decor: 5, num: 7, name: "梅花2", imageURL: plum2 },
  { cardId: 41, decor: 5, num: 7, name: "梅花3", imageURL: plum3 },
  { cardId: 42, decor: 5, num: 7, name: "梅花4", imageURL: plum4 },
  { cardId: 43, decor: 5, num: 7, name: "梅花5", imageURL: plum5 },
  { cardId: 44, decor: 5, num: 7, name: "梅花6", imageURL: plum6 },
  { cardId: 45, decor: 5, num: 7, name: "梅花7", imageURL: plum7 },
  { cardId: 46, decor: 5, num: 7, name: "梅花8", imageURL: plum8 },
  { cardId: 47, decor: 5, num: 7, name: "梅花9", imageURL: plum9 },
  { cardId: 48, decor: 5, num: 7, name: "梅花10", imageURL: plum10 },
  { cardId: 49, decor: 5, num: 7, name: "梅花J", imageURL: plum11 },
  { cardId: 50, decor: 5, num: 7, name: "梅花Q", imageURL: plum12 },
  { cardId: 51, decor: 5, num: 7, name: "梅花K", imageURL: plum13 },
  { cardId: 52, decor: 5, num: 7, name: "梅花A", imageURL: plum1 },
];
