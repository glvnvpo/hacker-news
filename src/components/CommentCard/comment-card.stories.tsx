import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {CommentCard} from './index';

const comment = {
	id: 123,
	by: 'superuser',
	text: 'Some text some text some text some text some text',
	time: 1672990489,
	deleted: false,
	dead: false,
	kids: [124, 125, 126, 127],
	children: [{
		id: 124,
		by: 'vasya',
		text: 'Nice joke, bro!',
		time: 1673076889,
		kids: [128],
		children: [{
			id: 128,
			by: 'ivan_ivan',
			text: 'Agree with you', 
			time: 1673076889
		}]
	},
	{
		id: 125,
		by: 'ivan_ivan',
		text: 'Great comment',
		time: 1673076889
	},
	{
		id: 126,
		by: 'kate_123',
		text: 'Great comment',
		time: 1673076889,
		dead: true
	},
	{
		id: 127,
		by: 'ivan_ivan',
		text: 'Great comment',
		time: 1673076889,
		deleted: true
	}]
};

export default {
	title: 'CommentCard',
	component: CommentCard,
	argTypes: {
		comment: {
			defaultValue: comment
		}
	}
} as ComponentMeta<typeof CommentCard>;

const Template: ComponentStory<typeof CommentCard> = (args) => <CommentCard {...args} />;

export const Default = Template.bind({});