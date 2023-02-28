import type { useLayoutEffect } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type effectHookType = typeof useEffect | typeof useLayoutEffect;

export const createUpdateEffect: (hook: effectHookType) => effectHookType = (hook) => (effect, deps) => {
	const isMounted = useRef(false);

	// for react-refresh
	hook(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	hook(() => {
		if (!isMounted.current) {
			isMounted.current = true;
		} else {
			return effect();
		}
	}, deps);
};

export const useUpdateEffect = createUpdateEffect(useEffect);

export const useUnmountedRef = () => {
	const unmountedRef = useRef(false);

	useEffect(() => {
		unmountedRef.current = false;

		return () => {
			unmountedRef.current = true;
		};
	}, []);
	return unmountedRef;
};

export const useUpdate = () => {
	const [, setState] = useState({});

	return useCallback(() => setState({}), []);
};
