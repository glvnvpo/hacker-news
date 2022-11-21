import React from 'react';
import {mount} from 'enzyme';
import {BrowserRouter} from 'react-router-dom';
import {StoryCard} from '../index';
import {Fields} from '../story-card';
import {MAIN_PAGE_PATH} from '../../../routing/constants';

describe('StoryCard', () => {
	let wrapper;

	const story = {
		id: 123,
		title: 'someTitle',
		by: 'someUser',
		time: '1662661417',
		score: 2,
		descendants: 1,
		url: 'https://reactjs.org/',
		text: 'someText',
	};
    
	it('should render correct StoryCard', () => {
		wrapper = mount(<StoryCard story={story} />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should render correct StoryCard as link', () => {
		const props = {
			story,
			asLink: true,
			to: `${MAIN_PAGE_PATH}/${story.id}`,
			extraFieldsToShow: []
		};
		wrapper = mount(
			<BrowserRouter>
				<StoryCard {...props} />
			</BrowserRouter>
		);
		expect(wrapper.find('Link').exists()).toBeTruthy();
	});

	it('should render without url', () => {
		const props = {
			story: {
				...story,
				url: undefined
			}
		};
		wrapper = mount(<StoryCard {...props} />);
		expect(wrapper.find('div.url').text()).toBe('No source link available');
	});

	it('should render without text', () => {
		const props = {
			story: {
				...story,
				text: undefined
			}
		};
		const expected = 'To read the text, visit the source';
		wrapper = mount(<StoryCard {...props} />);
		expect(wrapper.text()).toMatch(expected);
	});
	
	it('should render story with error', () => {
		wrapper = mount(<StoryCard story={undefined} />);
		const expected = 'Some troubles in loading story';
		expect(wrapper.text()).toBe(expected);
	});

	it('should render Spinner', () => {
		wrapper = mount(<StoryCard story={story} isLoading={true}  />);
		expect(wrapper.find('Spinner')).toHaveLength(1);
	});

	it('should render url and not text', () => {
		const props = {
			story,
			extraFieldsToShow: [Fields.URL]
		};
		wrapper = mount(<StoryCard {...props}  />);
		expect(wrapper.find('.url').exists()).toBeTruthy();
		expect(wrapper.find('.text').exists()).toBeFalsy();
	});
});