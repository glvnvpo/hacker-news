// @flow

import React from "react";
import {Button, Card} from "react-bootstrap";
import {isEmpty} from "lodash";
import parse from "html-react-parser";
import './styles.scss';
import type {Comment} from '../../types';
import {getDateFromTimestamp} from "../../helpers/get-date-from-timestamp";

type Props = {
	comment: Comment;
    parent?: boolean;
	onChangeVisibilityOfChildComment?: () => void;
}

export const CommentCard = ({parent=true, comment, onChangeVisibilityOfChildComment, ...rest}: Props) => {

	let {id, by, time, text, children} = comment;

	return (
		<Card
			className={`comment ${parent ? "parent" : "child"}`}
			border={parent ? "primary" : "success"}
			{...rest}>
			<Card.Body>
				<Card.Subtitle className="mb-2 color-grey">
					<span className="bold">{by}</span> | {getDateFromTimestamp(time)}
				</Card.Subtitle>
				<Card.Text className="bold color-dark-grey" as='span'>
					{text && parse(text)}
				</Card.Text>
				{ (!isEmpty(children) && parent) &&
                        <Button
                        	onClick={() => onChangeVisibilityOfChildComment(id)}
                        	className="mt-20"
                        	variant="outline-secondary">
							+{children.length} answer{children.length > 1 && 's'}
                        </Button>
				}
			</Card.Body>
		</Card>
	);
};