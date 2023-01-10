import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Layout} from './index';
import './styles.scss';

export default {
	title: 'Layout',
	component: Layout
} as ComponentMeta<typeof Layout>;

export const Default: ComponentStory<typeof Layout> = () => <div><Layout/></div>;