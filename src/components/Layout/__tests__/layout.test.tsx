import React from 'react';
import {mount} from 'enzyme';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from '../layout';

describe('Layout', () => {
	let wrapper;

	it('should render correct layout', () => {
		wrapper = mount(
			<BrowserRouter>
				<Routes>
					<Route element={<Layout/>}>
						<Route path='*' element={<div>test</div>}/>
					</Route>
				</Routes>
			</BrowserRouter>
		);
		expect(wrapper).toMatchSnapshot();
	});
});