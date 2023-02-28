import {
  MutableRefObject,
  useRef,
  DependencyList,
  EffectCallback,
  useEffect,
} from "react";

import { Dictionary } from "../interface/index";

/** 持久化函数 保证传入的值地址不变 */
export function useConstantRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export function depsAreSame(
  oldDeps: DependencyList,
  deps: DependencyList
): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

export function stringifySearchParams(search: Dictionary): string {
  const output: Dictionary = {};

  for (const key of Object.keys(search)) {
    const value = search[key];

    if (value != null) {
      output[key] = value;
    }
  }

  return new URLSearchParams(output).toString();
}

export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}


