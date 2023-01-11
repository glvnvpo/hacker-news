import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {BrowserRouter} from 'react-router-dom';
import {StoryCard} from './index';
import {Fields} from './story-card';

const story = {
	id: 123,
	title: 'Some title',
	by: 'superuser',
	time: 1673163289,
	score: 3,
	kids: [124, 125, 126, 127, 128],
	text: 'Some text some text some text some text some text some text',
	url: 'https://reactjs.org/',
	descendants: 5
};

export default {
	title: 'StoryCard',
	component: StoryCard,
	argTypes: {
		story: {
			defaultValue: story,
			id: {
				control: {
					type: 'number',
					min: 1
				}
			}
		},
		extraFieldsToShow: {
			options: [Fields.ALL, Fields.URL, Fields.TEXT],
			control: {
				type: 'inline-check'
			},
			defaultValue: [Fields.ALL]
		},
		isLoading: {
			defaultValue: false
		},
		asLink: {
			defaultValue: false
		},
		to: {
			defaultValue: '/example',
			if: {arg: 'asLink'}

		}
	},
} as ComponentMeta<typeof StoryCard>;

const Template: ComponentStory<typeof StoryCard> = (args) =>
	<BrowserRouter>
		<StoryCard {...args} />
	</BrowserRouter>;

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {isLoading: true};

export const Link = Template.bind({});
Link.args = {asLink: true, to: '/example123'};