/** 树节点 */
export interface TreeNode<T, ID = string> {
  /** 节点主键 */
  id: ID;
  /** 节点父键 */
  pid: ID;
  /** 祖先节点键 */
  ancestorIds: ID[];
  /** 节点属性 */
  attrs: T;
  /** 子孙节点 */
  children?: Array<TreeNode<T, ID>>;
}

/** 分页查询结果 */
export interface PageRows<T> {
  /** 分页数组 */
  rows: T[];
  /** 总大小 */
  count: number;
}

/** 分页查询条件 */
export interface PageQuery {
  /** 查询 limit */
  limit: number;
  /** 查询 offset */
  offset: number;
}

/** 域名变量 */
export interface ProjectPaths {
  /** 项目路径 */
  project: string;
  /** 后台 API */
  backend: string;
  /** CMS */
  cmsSale: string;
  /** 埋点 */
  flume: string;
}

/** 游戏卡片 */
export interface GameCard {
  // 黑桃 ♠️ 5
  // 红桃 ♥️ 4
  // 方块 ♦️ 3
  // 梅花 ♣️ 2
  // id
  cardId: number;
  /** 花色 */
  decor: number;
  /** 数字 */
  num: number;
  /** 卡名称 */
  name: string;
  /** 卡图片 */
  imageURL: string;
}

export interface RTArea {
  no: string;
  label: string;
}

export type RTAreaTreeNode = TreeNode<RTArea>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CM {
  export interface Activity {
    /** 游戏配置ID */
    actId: number;
    /** 主会场活动ID, 跳转主会场时带入参数ref=actId, 识别游戏页面跳入 */
    mainPageId?: string | number;
    /** 顶部图片 */
    headImg?: string;
    /** 分享至微信图 */
    shareWXImg?: string;
    /** 分享承接页背景图 */
    shareMiddleImg?: string;
    /** 活动名称 */
    activityName?: string;
    /** 背景图片 */
    bgImg?: string;
    /** 模板类型 */
    templateType?: string;
    /** 活动规则内容 */
    ruleContent?: string;
    /** 规则类型 1 文本，2 图片 */
    ruleType?: string;
    /** 活动规则图片 */
    ruleImg?: string;
    /** 活动开始时间 */
    beginTime?: string;
    /** 活动结束时间 */
    endTime?: string;
    /** 奖品配置列表 */
    prizeVoList?: Prize[];
  }

  export interface Prize {
    /** 奖品ID */
    id: number;
    /** 奖品图片 */
    prizeImg?: string;
  }

  export interface TokenInfo {
    /** 分享者微信名/手机号 */
    memName?: string;
    /** 分享微信头像 */
    memAvatar?: string;
    /** token类型 1：助力分享 2：赠送卡牌分享 */
    tokenType?: number;
    /** 赠送卡牌类型（助力时无此属性） */
    cardType?: string;
  }

  export interface UserActInfo {
    /** 用户guid */
    memGuid?: string;
    /** 用户对应MD5 */
    memMd5?: string;
    /** 用户总剩余抽奖次数 */
    prizeTimes?: number;
    /** 下单次数，默认0 */
    orderTimes?: number;
    /** 助力次数，默认0 */
    helperTimes?: number;
    /** 浏览次数，默认0 */
    viewTimes?: number;
  }

  export interface TokenApplyParams {
    /** 用户guid */
    memGuid: string;
    /** 用户MD5 */
    memMd5: string;
    /** 用户微信昵称(分享者) */
    memName?: string;
    /** 用户微信头像(分享者) */
    memAvatar?: string;
    /** 门店代码 */
    storeCode: string;
    /** 助力时为游戏配置ID，赠送卡牌时为卡牌类型 */
    tokenId: string;
    /** token类型 1：助力分享 2：赠送卡牌分享 */
    tokenType: number;
  }

  export interface ReceivedCoupon {
    /** ID */
    id?: number;
    /** 优惠券编码 */
    couponId?: string;
    /** 优惠券名称 */
    couponName?: string;
    /** 优惠券描述信息 */
    couponInfo?: string;
    /** 优惠券图片 */
    prizeImg?: string;
    /** 获取时间 */
    createTime?: string;
  }

  export interface ReceivedCard {
    /** 卡牌类型(见附类型说明) */
    cardType?: string;
    /** 卡牌来源(默认0：抽奖  1：赠送 2：万能卡兑换 3：合成（发发卡）) */
    cardFrom?: number;
    /** 卡牌状态 */
    cardStatus?: number;
    /** 获取时间 */
    createTime?: string;
  }

  export interface ReceivedPoint {
    /** ID */
    id?: number;
    /** 积分值 */
    points?: number;
    /** 获取时间 */
    createTime?: string;
  }

  export interface UserPrize {
    /** 优惠券列表 */
    couponList?: ReceivedCoupon[];
    /** 卡牌列表 */
    cardList?: ReceivedCard[];
    /** 积分列表 */
    pointsList?: ReceivedPoint[];
  }

  export interface SendRecord {
    /** 卡牌id */
    id?: string;
    /** 卡牌类型 */
    cardType?: string;
    /** 赠送用户微信名 */
    memName?: string;
    /** 赠送用户微信头像 */
    memAvatar?: string;
    /** 赠送领取时间 */
    receiveTime?: string;
  }

  export interface DrawPrizeResult {
    /** 奖品类型：0：未抽中 1优惠券 2：卡牌 3：积分 */
    prizeType?: number;
    /** 奖品类型ID */
    prizeId?: number;
    /** 用户总剩余抽奖次数 */
    prizeTimes?: number;
    /** 优惠券数据 */
    couponInfo?: ReceivedCoupon;
    /** 卡牌数据 */
    cardInfo?: ReceivedCard;
    /** 积分记录 */
    pointsInfo?: ReceivedPoint;
  }
}
