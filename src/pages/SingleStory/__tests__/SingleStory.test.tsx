import React, {Component} from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {isNull} from 'lodash';
import {SingleStory} from '../SingleStory';
import {Comment, Story} from '../../../types';
import {ITEM as mockITEM, NEW_STORIES as mockNEW_STORIES} from '../../../api/constants';
import {waitForComponentToPaint} from '../../../jest/helpers/wait-for-component-to-paint';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(() => () => {
	}),
	useParams: jest.fn(() => ({id: 123}))
}));

jest.mock('lodash', () => ({
	...jest.requireActual('lodash'),
	isNull: jest.fn((value) => value === null)
}));

let mockStory: Promise<{ data: Story | null }> = Promise.resolve({
	data: {
		id: 123,
		title: 'someTitle',
		text: 'someText',
		by: 'coolUser',
		time: 1666689031,
		score: 3,
		url: 'https://reactjs.org/',
		descendants: 10,
		kids: [125]
	}
});
let mockParentComment: Promise<{ data: Comment | null }> = Promise.resolve({
	data: {
		id: 125,
		parent: 123,
		text: 'someText',
		by: 'coolUser',
		time: 1666689031,
		kids: [127]
	}
});
let mockChildComment = Promise.resolve({
	data: {
		id: 127,
		parent: 125,
		text: 'someText127',
		by: 'coolUser127',
		time: 1666689031
	}
});
jest.mock('axios', () => ({
	__esModule: true,
	...jest.requireActual('axios'),
	default: jest.fn((url) => {
		if (url === mockNEW_STORIES()) {
			return Promise.resolve({data: [10]});
		} else if (url === mockITEM(123)) {
			return mockStory;
		} else if (url === mockITEM(125)) {
			return mockParentComment;
		} else if (url === mockITEM(127)) {
			return mockChildComment;
		}
	})
}));

describe('SingleStory', () => {
	let wrapper: ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>;
	
	const getWrapper = () => {
		jest.clearAllMocks();
		return mount(<BrowserRouter>
			<SingleStory/>
		</BrowserRouter>);
	};

	beforeEach(() => {
		wrapper = getWrapper();
	});

	it('should render Single story when loading', () => {
		expect(wrapper).toMatchSnapshot();
	});

	it('should call navigate', async () => {
		await waitForComponentToPaint();
		wrapper.find('.go-back').at(1).simulate('click');
		expect(useNavigate).toHaveBeenCalled();
	});

	it('should call isNull with empty data', async () => {
		mockParentComment = Promise.resolve({data: null});
		wrapper = getWrapper();
		await waitForComponentToPaint();
		// @ts-ignore
		expect(isNull.mock.calls[0][0]).toBeNull();
	});
	
	it('should not call isNull', async () => {
		mockParentComment = Promise.reject('Something went wrong');
		wrapper = getWrapper();
		await waitForComponentToPaint();
		expect(isNull).not.toHaveBeenCalled();
	});

	it('should call axios twice due to setTimeout', () => {
		jest.useFakeTimers();
		mockStory = Promise.resolve({
			data: null
		});
		wrapper = getWrapper();
		jest.advanceTimersByTime(60000);
		expect(axios).toHaveBeenCalledTimes(2);
	});

	it('should call axios returns reject', () => {
		mockStory = Promise.reject('Something went wrong');
		wrapper = getWrapper();
		expect(axios).toHaveBeenCalledTimes(1);
	});
});