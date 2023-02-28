import React, { HTMLAttributes } from 'react';
import { createBEM } from '../../utils/class-utils';
import { createFC } from '../../utils/react-utils';
import imgLoading from './assets/loading.png';
import './index.less';

const bem = createBEM('spin-loading');

type CProps = HTMLAttributes<HTMLDivElement>;

const SpinLoading = createFC<CProps>('SpinLoading', () => {
	return (
		<div className={bem()}>
			<img className={bem('loading')} src={imgLoading} />
		</div>
	);
});

export default SpinLoading;
