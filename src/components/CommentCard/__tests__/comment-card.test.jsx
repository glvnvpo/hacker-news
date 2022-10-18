import React from 'react';
import {mount} from 'enzyme';
import {CommentCard} from "../index";

describe('CommentCard', () => {
	let wrapper;

	const props = {
		comment: {
			id: 123,
			by: 'coolUser',
			time: '1662661417',
			text: 'someText',
			children: [124, 125]
		},
		onChangeVisibilityOfChildComment: jest.fn()
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	it('should render correct card', () => {
		wrapper = mount(<CommentCard {...props} />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should render correct child comment card', () => {
		const props = {
			parent: false,
			comment: {
				id: 123,
				by: 'coolUser',
				time: '1662661417',
				text: 'someText'
			}
		};
		wrapper = mount(<CommentCard {...props} />);
		expect(wrapper.find('Card').prop('border')).toBe('success');
		expect(wrapper.find('button')).toHaveLength(0);
	});

	it('should call onChangeVisibilityOfChildComment', () => {
		wrapper = mount(<CommentCard {...props} />);
		wrapper.find('button').simulate('click');
		expect(props.onChangeVisibilityOfChildComment).toHaveBeenCalledTimes(1);
	});
});