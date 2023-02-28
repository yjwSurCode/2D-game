import Cookies from "js-cookie";
import {
  FetchError,
  FetchWithResultOptions,
  FetchUtils,
} from "../utils/fetch-utils";
import { PROJECT_ENV, PROJECT_PATHS } from "./config";
import { ProjectEnv } from "./constants";

export class PerformanceRequestError extends FetchError {}
export interface PerformanceResponseData<T = any> {
  code: string;
  msg?: string;
  body: T;
}

class PerformanceAPI {
  readonly client: FetchUtils<
    FetchWithResultOptions<PerformanceResponseData>,
    PerformanceResponseData
  > = FetchUtils.create()
    .with((fetch) => (url, options) => {
      /** 判断当前环境 */
      if (PROJECT_ENV !== ProjectEnv.Online) {
        console.log("!!!!!!!!!!!!!!!", url, options);
        // this.logger.info(
        //   `URL: ${url} Authorization: ${options.headers?.["Authorization"]} Payload: ${options.body}`
        // );
      }

      return fetch(url, options);
    })
    .withPayload({
      payloadType: "json",
    })
    .withHeaders({
      headers: async () => {
        const token = "cookie-token"; //Cookies.get(PORTAL_SSO_COOKIE_KEY);
        return token ? { Authorization: token } : {};
      },
    })
    .withParams()
    .witSuffix()
    .withPrefix({
      prefix: PROJECT_PATHS.project,
    })
    .withThrowNonOk({
      throwNonOk: true,
    })
    .withDataHandler<PerformanceResponseData<any>>({
      /** 可自定义dataHandler */
      dataHandler: async (res, executor) => {
        const _data = await executor(res, "json");

        // const data: PerformanceResponseData = {
        //   code: _data.rsCode,
        //   body: _data.body,
        //   msg: _data.msg,
        // };

        const data: PerformanceResponseData = {
          code: _data.rsCode,
          body: _data,
          msg: _data.msg,
        };

        if (data.code !== "200") {
          throw new PerformanceRequestError(
            data.msg || `服务器返回了错误的代码：${data.code}`,
            {
              ...res,
              data,
            }
          );
        }

        return data;
      },
    });

  isControllableError(err: any): err is PerformanceRequestError {
    if (this.isUserNeedLoginError(err)) {
      return false;
    }

    return err instanceof PerformanceRequestError;
  }

  isUserNeedLoginError(err: any): err is PerformanceRequestError {
    if (err instanceof PerformanceRequestError) {
      return err.data?.code === "00000401";
    }

    return false;
  }
  /**  传递参数详情可查类型FetchWithResultOptions*/
  async request<R = any>(
    url: string,
    options?: FetchWithResultOptions<PerformanceResponseData>
  ): Promise<PerformanceResponseData<R>> {
    console.log("请求前置", url, options, PROJECT_PATHS.project);
    const { data } = await this.client.request(url, options || {});
    return data;
  }
}

export const PERFORMANCE_API = new PerformanceAPI();
