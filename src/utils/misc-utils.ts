import { Dictionary } from '../interface/index';

/** 空方法 */
export function noop(): void {
	// empty
}

export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

export function padZero(num: number | string, targetLength = 2): string {
	let str = num + '';

	while (str.length < targetLength) {
		str = '0' + str;
	}

	return str;
}

interface EventBus {
	/**
	 * Register an event handler for the given type.
	 *
	 * @param type	Type of event to listen for, or `"*"` for all events
	 * @param handler Function to call in response to given event
	 */
	on: (type: string, handler: (event?: any) => void) => void;

	/**
	 * Remove an event handler for the given type.
	 *
	 * @param type	Type of event to unregister `handler` from, or `"*"`
	 * @param handler Handler function to remove
	 */
	off: (type: string, handler: (event?: any) => void) => void;

	/**
	 * Invoke all handlers for the given type.
	 * If present, `"*"` handlers are invoked after type-matched handlers.
	 *
	 * Note: Manually firing "*" handlers is not supported.
	 *
	 * @param type  The event type to invoke
	 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
	 */
	emit: (type: string, evt: any) => void;
}

export function createEventBus(): EventBus {
	const events: Dictionary = {};

	return {
		on: (type, handler) => {
			(events[type] || (events[type] = [])).push(handler);
		},
		off: (type, handler) => {
			if (events[type]) {
				events[type].splice(events[type].indexOf(handler) >>> 0, 1);
			}
		},
		emit: (type, evt) => {
			(events[type] || []).slice().forEach((handler: any) => {
				handler(evt);
			});
			(events['*'] || []).slice().forEach((handler: any) => {
				handler(type, evt);
			});
		},
	};
}
