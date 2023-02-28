import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUnmountedRef, useUpdate } from "./use-life-cycle";

type FuncUpdater<T> = (previousState?: T) => T;

export type StoreStateDefaultValue<T> = T | FuncUpdater<T>;

export type StorageStateResult<T> = [
  T | undefined,
  (value: StoreStateDefaultValue<T>) => void
];

export type RequiredStorageStateResult<T> = [
  T,
  (value: StoreStateDefaultValue<T>) => void
];

export interface StateHelper<T> {
  getValue: () => T;
  setValue: (newValue: T) => void;
  subscribe: (listener: () => void) => () => void;
}

function isFunction<T>(obj: any): obj is T {
  return typeof obj === "function";
}

export function useStateHelper<T>(
  state: StateHelper<T>
): RequiredStorageStateResult<T> {
  const update = useUpdate();
  const valueRef = useRef<T>(state.getValue());

  const setEnv = useCallback(
    (data: StoreStateDefaultValue<T>) => {
      const newState = isFunction<FuncUpdater<T>>(data)
        ? data(state.getValue())
        : data;
      state.setValue(newState);
    },
    [state]
  );

  useEffect(() => {
    const unSubscribe = state.subscribe(() => {
      valueRef.current = state.getValue();
      update();
    });
    return unSubscribe;
  }, [state, update]);

  return [valueRef.current, setEnv];
}

export function useSafeState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];

export function useSafeState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];

export function useSafeState(initialState?: any) {
  const unmountedRef = useUnmountedRef();

  const [state, setState] = useState(initialState);

  const setCurrentState = useCallback(
    (currentState: any) => {
      /** 如果组件已经卸载则不再更新 state */
      if (unmountedRef.current) return;
      setState(currentState);
    },
    [unmountedRef]
  );

  return [state, setCurrentState] as const;
}

type GetStateAction<S> = () => S;

export function useGetState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, GetStateAction<S>];
export function useGetState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  GetStateAction<S | undefined>
];
export function useGetState<S>(initialState?: S) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const getState = useCallback(() => stateRef.current, []);

  return [state, setState, getState];
}

export function useDefaults<T>(defaultValue: T, ...args: Array<T | void>): T {
  for (const v of args) {
    if (v != null) {
      return v;
    }
  }

  return defaultValue;
}

export function useDefaultsRef<T>(
  defaultValue: T,
  ...args: Array<T | void>
): RefObject<T> {
  const value = useDefaults<T>(defaultValue, ...args);

  const ref = useRef(value);
  ref.current = value;

  return ref;
}
