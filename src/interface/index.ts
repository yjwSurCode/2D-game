export type Dictionary<T = any> = { [key: string]: T };

// https://medium.com/@dhruvrajvanshi/making-exceptions-type-safe-in-typescript-c4d200ee78e9
export interface OkRes<R> {
  isError: false;
  value: R;
}

export interface ErrRes<E> {
  isError: true;
  error: E;
}

export type Res<R, E> = OkRes<R> | ErrRes<E>;

/**
 * 产生一个成功的结果
 *
 * @export
 * @template R 结果类型
 * @param value 结果参数
 * @returns
 */
export function okRes<R = any>(value: R): OkRes<R> {
  return { isError: false, value };
}

/**
 * 产生一个失败的结果
 *
 * @export
 * @template E 失败类型
 * @param error 失败参数
 * @returns
 */
export function errRes<E = string>(error: E): ErrRes<E> {
  return { isError: true, error };
}
