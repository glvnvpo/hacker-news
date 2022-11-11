import React from 'react';
import {mount} from 'enzyme';
import axios from 'axios';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createStore} from '@reduxjs/toolkit';
import {isNull} from "lodash";
import {Main} from '../Main';
import {NEW_STORIES as mockNEW_STORIES} from "../../../api/constants";
import {waitForComponentToPaint} from "../../../jest/helpers/wait-for-component-to-paint";

let mockLoadNewStories = Promise.resolve({data: [10]});
let mockLoadOneStory = Promise.resolve({
	data: {
		id: 10,
		title: 'someTitle',
		by: 'coolUser',
		time: 1666689031,
		score: 3,
		url: 'https://reactjs.org/',
		descendants: 10
	}
});

jest.mock('axios', () => ({
	__esModule: true,
	...jest.requireActual('axios'),
	default: jest.fn((url) => {
		if (url === mockNEW_STORIES()) {
			return mockLoadNewStories;
		} else return mockLoadOneStory;
	})
}));

jest.mock('lodash', () => ({
	...jest.requireActual('lodash'),
	isNull: jest.fn((value) => value === null)
}));

describe('Main', () => {
	let wrapper;

	let initValue = [{
		id: 20,
		title: 'someTitle',
		by: 'coolUser',
		time: 1666689031,
		score: 4,
		url: 'https://reactjs.org/',
		descendants: 10
	}];
	
	const getWrapper = (initStore = initValue) => {
		const store = createStore(() => ({
			stories: {
				value: initStore
			}
		}));

		return mount(<Provider store={store}>
			<BrowserRouter>
				<Main/>
			</BrowserRouter>
		</Provider>);
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	it('should render Main page with correct card', () => {
		wrapper = getWrapper();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render Spinner', () => {
		wrapper = getWrapper([]);
		expect(wrapper.find('Spinner').exists()).toBeTruthy();
	});

	it('should call isNull with correct data', async () => {
		mockLoadOneStory = Promise.resolve({
			data: null
		});
		wrapper = getWrapper();
		await waitForComponentToPaint();
		expect(isNull).toHaveBeenCalledWith(null);
	});

	it('should not call isNull', async () => {
		mockLoadOneStory = Promise.reject();
		wrapper = getWrapper();
		await waitForComponentToPaint();
		expect(isNull).not.toHaveBeenCalled();
	});

	it('should call axios twice', () => {
		wrapper = getWrapper();
		waitForComponentToPaint();
		mockLoadNewStories = Promise.reject();
		wrapper.find('.header .btn').simulate('click');
		expect(axios).toHaveBeenCalledTimes(2);
	});
});