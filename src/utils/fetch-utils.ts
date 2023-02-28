import { Dictionary } from "../interface/index";
import { ArtisanError } from "../interface/request";
import "whatwg-fetch";

export interface ArtisanErrorOptions {
  cause?: any;
}

import { stringifySearchParams } from "../utils/use-state";

export interface FetchPrefixOptions {
  prefix?: string;
}

export interface FetchSuffixOptions {
  suffix?: string;
}

export interface FetchParamsOptions {
  params?: Dictionary;
}

export interface FetchHeadersProvider {
  headers?: () => Promise<Dictionary>;
}

export interface FetchPayloadOptions {
  payload?: any;
  payloadType?: "json" | "form" | "raw";
}

export interface FetchThrowNonOkOptions {
  throwNonOk?: boolean;
}

export interface FetchDataHandlerOptions<T, N> {
  dataHandler?: (
    res: FetchResult<T>,
    executor: (res: FetchResult<T>, type: string) => Promise<any>
  ) => Promise<N>;
}

export interface FetchInitOptions extends Omit<RequestInit, "headers"> {
  headers?: Dictionary;
}

// usage
//Partial<FetchInitOptions> 此处可直接写FetchInitOptions
export type FetchOptions = Partial<FetchInitOptions> &
  FetchPrefixOptions &
  FetchSuffixOptions &
  FetchParamsOptions &
  FetchPayloadOptions &
  FetchThrowNonOkOptions;

export type FetchWithResultOptions<R> = FetchOptions &
  FetchDataHandlerOptions<FetchOptions, R>;

export interface FetchRequest extends FetchInitOptions {
  url: string;
}

export interface FetchResult<T = any> {
  request: FetchRequest;
  response: Response;
  data: T;
}

export type Fetch<O extends FetchInitOptions = FetchInitOptions, R = any> = (
  url: string,
  options: O
) => Promise<FetchResult<R>>;

export interface FetchErrorOptions extends ArtisanErrorOptions {
  request: FetchRequest;
  response: Response;
  data: any;
}

export class FetchError extends ArtisanError {
  request: FetchRequest;
  response: Response;
  data: any;

  constructor(message: string, options: FetchErrorOptions) {
    super(message, options);
    this.request = options.request;
    this.response = options.response;
    this.data = options.data;
  }
}

const FETCH_KEYS: Array<keyof FetchInitOptions> = [
  "body",
  "cache",
  "credentials",
  "headers",
  "integrity",
  "keepalive",
  "method",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "signal",
  "window",
];

export class FetchUtils<O extends FetchInitOptions, R> {
  private constructor(private _fetch: Fetch<O>) {}

  static create(): FetchUtils<FetchInitOptions, undefined> {
    return new FetchUtils(async (url, options) => {
      const opts: FetchInitOptions = {};

      for (const key of FETCH_KEYS) {
        if (key in options) {
          (opts as any)[key] = options[key];
        }
      }

      const response = await fetch(url, opts);

      return {
        request: { ...opts, url },
        response,
        data: undefined,
      };
    });
  }

  static extend<NO extends FetchInitOptions = FetchInitOptions, NR = undefined>(
    fetch: Fetch<NO, NR>
  ): FetchUtils<NO, NR> {
    return new FetchUtils(fetch);
  }

  with<NO extends FetchInitOptions = O, NR = R>(
    middleware: (fetch: Fetch<O, R>) => Fetch<NO, NR>
  ): FetchUtils<NO, NR> {
    return new FetchUtils(middleware(this._fetch));
  }

  withPrefix(opts?: FetchPrefixOptions): FetchUtils<O & FetchPrefixOptions, R> {
    return new FetchUtils(async (url, options) => {
      const prefix = options.prefix != null ? options.prefix : opts?.prefix;

      return this._fetch(prefix ? `${prefix}${url}` : url, options);
    });
  }

  witSuffix(opts?: FetchSuffixOptions): FetchUtils<O & FetchSuffixOptions, R> {
    return new FetchUtils(async (url, options) => {
      const suffix = options.suffix != null ? options.suffix : opts?.suffix;

      if (suffix) {
        const idx = url.indexOf("?");

        if (idx < 0) {
          url = `${url}${suffix}`;
        } else {
          url = `${url.slice(0, idx)}${suffix}${url.slice(idx)}`;
        }
      }

      return this._fetch(url, options);
    });
  }

  withHeaders(opts?: FetchHeadersProvider): FetchUtils<O, R> {
    return new FetchUtils(async (url, options) => {
      let headers: Dictionary | undefined = options.headers;

      if (opts?.headers) {
        headers = {
          ...(await opts.headers()),
          ...options.headers,
        };
      }

      return this._fetch(url, {
        ...options,
        headers,
      });
    });
  }

  withParams(opts?: FetchParamsOptions): FetchUtils<O & FetchParamsOptions, R> {
    return new FetchUtils(async (url, options) => {
      let params: Dictionary | undefined;

      if (options.params || opts?.params) {
        params = { ...opts?.params, ...options.params };
      }

      if (params) {
        const query = stringifySearchParams(params);

        if (query) {
          const urlSign = url.indexOf("?") < 0 ? "?" : "&";
          url = `${url}${urlSign}${query}`;
        }
      }

      return this._fetch(url, options);
    });
  }

  withPayload(
    opts?: Pick<FetchPayloadOptions, "payloadType">
  ): FetchUtils<O & FetchPayloadOptions, R> {
    return new FetchUtils(async (url, options) => {
      const { method = "get", payload } = options;

      if (
        ["post", "put", "patch", "delete"].indexOf(method.toLowerCase()) === -1
      ) {
        return this._fetch(url, {
          ...options,
          body: undefined,
        });
      }

      const payloadType = options.payloadType || opts?.payloadType || "raw";

      let headers: Dictionary = { ...options.headers };
      let body: any = options.body;

      if (payload) {
        const dataType = Object.prototype.toString.call(payload);

        if (dataType === "[object Object]" || dataType === "[object Array]") {
          if (payloadType === "json") {
            headers = {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              ...headers,
            };

            body = JSON.stringify(payload);
          } else if (payloadType === "form") {
            headers = {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              ...headers,
            };

            body = stringifySearchParams(payload);
          }
        } else {
          // 其他 bodyType 自定义header
          headers = {
            Accept: "application/json",
            ...headers,
          };

          body = payload;
        }
      }

      return this._fetch(url, {
        ...options,
        headers,
        body,
      });
    });
  }

  withThrowNonOk(
    opts?: FetchThrowNonOkOptions
  ): FetchUtils<O & FetchThrowNonOkOptions, R> {
    return new FetchUtils(async (url, options) => {
      const throwNonOk =
        options.throwNonOk != null ? options.throwNonOk : opts?.throwNonOk;

      const res = await this._fetch(url, options);

      if (!res.response.ok && throwNonOk) {
        throw new FetchError(
          `请求返回了错误的状态码: ${res.response.status}`,
          res
        );
      }

      return res;
    });
  }

  withDataHandler<NR>(
    opts?: FetchDataHandlerOptions<O, NR>
  ): FetchUtils<O & FetchDataHandlerOptions<O, NR>, NR> {
    return new FetchUtils<O & FetchDataHandlerOptions<O, NR>, NR>(
      async (url, options) => {
        const res = await this._fetch(url, options);
        console.log("withDataHandler", res);
        const handler =
          options.dataHandler || opts?.dataHandler || ((r, e) => e(r, "json"));

        const data = await handler(res, async (res, type) => {
          try {
            return await (res.response as any)[type]();
          } catch (e) {
            throw new FetchError("请求返回了错误的数据格式", {
              ...res,
              data: undefined,
            });
          }
        });

        return {
          ...res,
          data,
        };
      }
    );
  }

  async request(url: string, options: O): Promise<FetchResult<R>> {
    return this._fetch(url, {
      method: "get",
      ...options,
    });
  }
}
