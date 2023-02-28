/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { useMemoizedFn } from './use-advanced';
import { useUpdateEffect } from './use-life-cycle';

type noop = (...args: any[]) => any;

type ReturnValue<T extends any[]> = [(...args: T) => void, { cancel: () => void }];

export function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
	const lockRef = useRef(false);

	return useCallback(
		async (...args: P) => {
			if (lockRef.current) return;
			lockRef.current = true;
			try {
				const ret = await fn(...args);
				lockRef.current = false;
				return ret;
			} catch (e) {
				lockRef.current = false;
				throw e;
			}
		},
		[fn],
	);
}

export function useLockMemoizedFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
	fn = useMemoizedFn(fn);
	return useLockFn(fn);
}

export function useDebounceFn<T extends any[]>(fn: (...args: T) => any, wait: number): ReturnValue<T>;
export function useDebounceFn<T extends any[]>(
	fn: (...args: T) => any,
	deps: DependencyList,
	wait: number,
): ReturnValue<T>;
export function useDebounceFn<T extends any[]>(
	fn: (...args: T) => any,
	deps: DependencyList | number,
	wait?: number,
): ReturnValue<T> {
	const _deps: DependencyList = (Array.isArray(deps) ? deps : []) as DependencyList;
	const _wait: number = typeof deps === 'number' ? deps : wait || 0;
	const timer = useRef<any>();

	const fnRef = useRef<noop>(fn);
	fnRef.current = fn;

	const cancel = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
	}, []);

	const run = useCallback(
		(...args: any) => {
			cancel();
			timer.current = setTimeout(() => {
				fnRef.current(...args);
			}, _wait);
		},
		[_wait, cancel],
	);

	useUpdateEffect(() => {
		run();
		return cancel;
	}, [..._deps, run]);

	useEffect(() => {
		return cancel;
	}, [cancel]);

	return [run, { cancel }];
}

export function useDebounce<T>(value: T, wait: number): T {
	const [state, setState] = useState(value);

	useDebounceFn(
		() => {
			setState(value);
		},
		[value],
		wait,
	);

	return state;
}

export function useThrottleFn<T extends any[]>(fn: (...args: T) => any, wait: number): ReturnValue<T>;
export function useThrottleFn<T extends any[]>(
	fn: (...args: T) => any,
	deps: DependencyList,
	wait: number,
): ReturnValue<T>;
export function useThrottleFn<T extends any[]>(
	fn: (...args: T) => any,
	deps: DependencyList | number,
	wait?: number,
): ReturnValue<T> {
	const _deps: DependencyList = (Array.isArray(deps) ? deps : []) as DependencyList;
	const _wait: number = typeof deps === 'number' ? deps : wait || 0;
	const timer = useRef<any>();

	const fnRef = useRef<noop>(fn);
	fnRef.current = fn;

	const currentArgs = useRef<any>([]);

	const cancel = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = undefined;
	}, []);

	const run = useCallback(
		(...args: any) => {
			currentArgs.current = args;
			if (!timer.current) {
				timer.current = setTimeout(() => {
					fnRef.current(...currentArgs.current);
					timer.current = undefined;
				}, _wait);
			}
		},
		[_wait],
	);

	useUpdateEffect(() => {
		run();
	}, [..._deps, run]);

	useEffect(() => {
		return cancel;
	}, [cancel]);

	return [run, { cancel }];
}

export function useThrottle<T>(value: T, wait: number): T {
	const [state, setState] = useState(value);

	useThrottleFn(
		() => {
			setState(value);
		},
		[value],
		wait,
	);

	return state;
}
