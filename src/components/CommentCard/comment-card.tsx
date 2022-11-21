// @flow

import React, {FC, ReactNode} from 'react';
import {Button, Card} from 'react-bootstrap';
import {isEmpty} from 'lodash';
import parse from 'html-react-parser';
import './styles.scss';
import {Spinner} from '../Spinner';
import {Sizes} from '../Spinner/spinner';
import type {Comment} from '../../types';
import {getDateFromTimestamp} from '../../helpers/get-date-from-timestamp';

type Props = {
	comment: Comment;
    isParent?: boolean;
	showAnswers?: (parentComment: Comment) => void;
	children?: ReactNode;
}

export const CommentCard: FC<Props> = ({comment, isParent = true,
										   showAnswers, children, ...rest}) => {

	let {by, time, deleted, dead, kids, isLoadingChildren, showChildComment} = comment;
	
	const getBtnText = (isOpen: boolean | undefined): string => {
		if (isOpen) {
			return 'Hide answers';
		}
		return 'Show answers';
	};

	const getContent = (comment: Comment): string | JSX.Element | JSX.Element[] => {
		const {text, deleted, dead} = comment;

		if (deleted) {
			return 'This comment was deleted';
		}

		if (dead) {
			return 'Comment not available';
		}

		return parse(text);
	};

	let classes: string = `${isParent ? 'parent' : 'child'} ${deleted ? 'deleted' : ''} ${dead ? 'dead' : ''}`;

	return (
		<Card
			className={`comment ${classes}`}
			border={isParent ? 'primary' : undefined}
			{...rest}>
			<Card.Body>
				<Card.Subtitle className='mb-2 color-grey'>
					<span className='bold'>{by}</span>{ by && '\u00A0|\u00A0'}{getDateFromTimestamp(time)}
				</Card.Subtitle>
				<Card.Text className='bold color-dark-grey' as='span'>
					{getContent(comment)}
				</Card.Text>
				{ (!isEmpty(kids) && isParent && showAnswers) &&
                        <Button
                        	onClick={() => showAnswers(comment)}
                        	className='mt-20'
                        	variant='light'
                        >
                        	{ isLoadingChildren ? <Spinner size={Sizes.SM} /> : getBtnText(showChildComment)}
                        </Button>
				}
				{children}
			</Card.Body>
		</Card>
	);
};