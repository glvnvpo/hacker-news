import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Spinner} from './index';
import {Sizes, Variants} from './spinner';

export default {
	title: 'Spinner',
	component: Spinner,
	argTypes: {
		variant: {
			defaultValue: Variants.SECONDARY,
			options: [Variants.PRIMARY, Variants.SECONDARY]
		},
		size: {
			options: [Sizes.SM],
			control: {
				type: 'check',
				labels: {
					[Sizes.SM]: 'small'
				}
			}
		}
	},
	parameters: {controls: {sort: 'requiredFirst'}},
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});

export const Primary = Template.bind({});
Primary.args = {variant: Variants.PRIMARY};

export const Small = Template.bind({});
Small.args = {size: Sizes.SM};