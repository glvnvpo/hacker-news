// @flow

import React from 'react';
import {Outlet} from 'react-router-dom';
import './styles.scss';

export const Layout = () => {
	return (
		<>
			<div className='layout'>
				<h2>HACKER NEWS</h2>
			</div>
			<Outlet/>
		</>
	);
};