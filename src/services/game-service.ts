import { PERFORMANCE_API } from "../core/api";

class GameCase {
  //玩家加入房间
  async join_room(query: {
    roomId?: number | string | null;
    playerId: number | string | null;
    //! Promise<any[]>    Promise<any>   返回值类型注意
  }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/player/join",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  //玩家离开房间
  async leave_room(query: {
    roomId?: number | string | null;
    playerId?: number | string | null;
  }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/player/leave",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  // 玩家准备

  async user_prepare(query: {
    playerId: number;
    roomId: number;
    isPlayerReady: boolean;
  }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/player/ready",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  //开始游戏;
  async start_game(query: { roomId: number }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/game/start",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  //结束游戏
  async over_game(query: { roomId: number | null }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/game/end",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  //刷新页面
  async refresh_page(query: { roomId: number | null }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      `/room/get?id=${query.roomId}`,
      {
        method: "get",
        // payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );

    return { code, body, msg };
  }

  // action	string 下注动作 （PASS：过牌；FOLD：弃牌；BET：加注；CALL：跟注）
  // isPlayerReady	boolean true 准备，false待机
  // playerId	integer($int64) 用户id
  // quantity	integer($int32) 下注筹码

  //玩家下注
  async betting(query: {
    roomId?: number | string | null;
    playerId?: number | string | null;
    quantity?: number;
    action: string;
  }): Promise<any> {
    const { code, body, msg } = await PERFORMANCE_API.request(
      "/room/game/player/action",
      {
        method: "post",
        payload: query,
        dataHandler: async (res, executor) => {
          const _data = await executor(res, "json");

          const data: any = {
            code: _data.errorCode,
            body: _data.data,
            msg: _data.message,
          };

          return data;
        },
      }
    );
    return { code, body, msg };
  }

  //获取表格数据
  async table_data(): Promise<any[]> {
    const { body } = await PERFORMANCE_API.request("/room/player/leave", {
      method: "post",
      payload: {
        playerId: 2,
        roomId: 1,
      },
      // dataHandler: () => {},
    });

    return body;
  }
}

export const GameCaseApi = new GameCase();
