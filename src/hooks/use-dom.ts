// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lifecycle from 'page-lifecycle';
import { useEffect } from 'react';
import { useMemoizedFn } from './use-advanced';

// https://www.zhangxinxu.com/wordpress/2021/11/js-visibilitychange-pagehide-lifecycle/
interface PageStateEvent {
	oldState: 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated' | 'discarded';
	newState: 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated' | 'discarded';
}

export function usePageStateChange(cb: (e: PageStateEvent) => void) {
	cb = useMemoizedFn(cb);

	useEffect(() => {
		const handler = (e: any) => {
			cb({
				oldState: e.oldState,
				newState: e.newState,
			});
		};

		lifecycle.addEventListener('statechange', handler);

		return () => {
			lifecycle.removeEventListener('statechange', handler);
		};
	}, [cb]);
}
