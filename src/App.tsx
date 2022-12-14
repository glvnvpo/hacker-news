// @flow

import React, {FC} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {Main, SingleStory} from './pages';
import {Layout} from './components/Layout';
import {MAIN_PAGE_PATH, ROOT_PATH, SINGLE_STORY_PAGE_PATH} from './routing/constants';

export const  App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={ROOT_PATH} element={<Layout/>}>
					<Route index element={<Navigate to={MAIN_PAGE_PATH} replace />}/>
					<Route path={MAIN_PAGE_PATH} element={<Main/>}/>
					<Route path={SINGLE_STORY_PAGE_PATH} element={<SingleStory />}/>
					<Route path='*' element={<Navigate to={MAIN_PAGE_PATH} replace />}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

