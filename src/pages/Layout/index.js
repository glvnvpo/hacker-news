// @flow

import React from 'react';
import {Outlet} from 'react-router-dom';

type Props = {

}

export const Layout = (props: Props) => {
	return (
		<>
			<div>LAYOUT PAGE</div>
			<Outlet/>
		</>
	);
};