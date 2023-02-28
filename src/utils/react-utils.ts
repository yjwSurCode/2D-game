import {
	DependencyList,
	forwardRef,
	ForwardRefExoticComponent,
	ForwardRefRenderFunction,
	FunctionComponent,
	PropsWithoutRef,
	RefAttributes,
} from 'react';

export const createForwardRef = <T, P = any>(
	displayName: string,
	render: ForwardRefRenderFunction<T, P>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> => {
	render.displayName = displayName;
	return forwardRef(render);
};

export const createFC = <P = any>(displayName: string, fc: FunctionComponent<P>): FunctionComponent<P> => {
	fc.displayName = displayName;
	return fc;
};

export function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
	if (oldDeps === deps) return true;
	for (let i = 0; i < oldDeps.length; i++) {
		if (!Object.is(oldDeps[i], deps[i])) return false;
	}
	return true;
}
