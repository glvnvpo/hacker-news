// @flow

import React, {FC, HTMLAttributes} from 'react';
import {Spinner} from 'react-bootstrap';

export enum Variants {
	SECONDARY = 'secondary',
	PRIMARY = 'primary'
}

export enum Sizes {
	SM = 'sm'
}

type Props = {
	variant?: Variants;
	size?: Sizes;
}

export const SpinnerComponent: FC<Props & HTMLAttributes<any>> = ({variant = Variants.SECONDARY, size, ...rest}) => {

	return (
		<div className='spinner'>
			<Spinner animation='border' variant={variant} size={size} {...rest} />
		</div>
	);
};