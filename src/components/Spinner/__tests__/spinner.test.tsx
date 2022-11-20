import React from 'react';
import {mount} from 'enzyme';
import {Spinner} from '../index';
import {Variants} from '../spinner';

describe('Spinner', () => {
	let wrapper;

	it('should return default spinner', () => {
		wrapper = mount(<Spinner/>);
		expect(wrapper.find('Spinner').prop('variant')).toBe('secondary');
	});

	it('should return spinner with correct style', () => {
		const variant = Variants.PRIMARY;
		wrapper = mount(<Spinner variant={variant} />);
		expect(wrapper.find('Spinner').prop('variant')).toBe(variant);
	});
	
	it('should pass props', () => {
		const props = {
			variant: Variants.PRIMARY,
			className: 'mt-20'
		};
		wrapper = mount(<Spinner {...props} />);
		const expected = {
			...props,
			animation: 'border'
		};
		expect(wrapper.find('Spinner').props()).toEqual(expected);
	});
});