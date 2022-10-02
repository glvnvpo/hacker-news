// @flow

import React, { useState, useEffect }  from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import parse from 'html-react-parser';
import axios from 'axios';
import {isEmpty, isNull} from "lodash";
import './styles.scss';
import {ITEM} from "../../api/constants";
import {MINUTE} from "../../constants/time";
import {MAIN_PAGE_PATH} from "../../routing/constants";
import {getDateFromTimestamp} from "../../helpers/get-date-from-timestamp";

type Story = {
	id: number | string;
	title: string;
	by: string;
	time: number | string;
	score: number | string;
	kids?: Array<number | string>;
	text?: string;
	descendants?: number | string;
}

type Comment = {
	id: number | string;
	by: string;
	text: string;
	time: number | string;
	kids?: Array<number | string>;
	children?: Array<Comment>;
	showChildComment?: boolean;
}

export const SingleStory = () => {
	const {id} = useParams();

	const [story, setStory] = useState({});
	const [comments, setComments] = useState([]);

	const navigate = useNavigate();
	let location = useLocation();

	let timer;

	useEffect(() => {
		updateStoryAndCommentsEachMinute(id);
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStory = (id: number | string): Promise<Story | string> => {
		return new Promise((resolve) => {
			axios(ITEM(id))
				.then(({data}) => {
					setStory(data);
					resolve(data);
				})
				.catch((err) => console.error(err));
		});
	};

	const updateStoryAndComments = (id: number | string) => {
		loadStory(id)
			.then((data)=> loadComments(data));
	};

	const updateStoryAndCommentsEachMinute = (id: number | string) => {
		updateStoryAndComments(id);
		timer = setTimeout(() => updateStoryAndCommentsEachMinute(id), MINUTE);
	};

	const goBackToStories = () => {
		navigate(MAIN_PAGE_PATH);
	};

	const loadComments = ({kids}: Story = {}) => {
		if (kids && !isEmpty(kids)) {
			const promises = kids.map(loadOneComment);
			Promise.all(promises)
				.then(loadedComments => {
					const childrenPromises = loadedComments.map(loadChildrenComments);
					return Promise.all(childrenPromises);
				})
				.then((loadedComments) => setComments(loadedComments));
		}
	};

	const loadChildrenComments = (comment: Comment): Promise<Comment> => {
		const {id, kids} = comment || {};

		return new Promise((resolve) => {
			if (id && kids && !isEmpty(kids)) {
				const promises = kids.map(loadOneComment);
				Promise.all(promises)
					.then(childrenComm =>
						resolve({...comment, children: childrenComm, showChildComment: false})
					);
			}
			else resolve(comment);
		});
	};

	const loadOneComment = (id: string | number): Promise<Comment | string> => {
		return new Promise((resolve, reject) => {
			axios(ITEM(id))
				.then(({data}) => !isNull(data) && resolve(data))
				.catch(err => reject(err));
		});
	};

	const changeVisibilityOfChildComment = (parentId: number | string) => {
		const parentComment = comments.filter(({id}) => parentId === id)[0];
		const newVisibility = !parentComment.showChildComment;
		const newComments = comments.map(
			(comment) => comment.id === parentId ?
				{...parentComment, showChildComment: newVisibility}
				: comment
		);
		
		setComments(newComments);
	};

	let {title, score, by, time, url, descendants, text} = story || {};

	return (
		<div className="single-story">
			<div className='content'>

				<Button className="mt-20 mb-10" onClick={() => goBackToStories()} variant="outline-primary">Go back to news</Button>

				<Card className='story mt-10 mb-20 border-orange'>
					<Card.Body>
						<Card.Title className="color-orange">{title}</Card.Title>
						<Card.Subtitle className="mb-2 color-grey">{score} points | {by} | {getDateFromTimestamp(time)}</Card.Subtitle>
						<Card.Subtitle className="mb-2 color-grey">
							{url ? <a href={url} target="_blank" rel="noreferrer">Source</a> : 'No source'}
						</Card.Subtitle>
						<Card.Subtitle className="mb-2 color-grey">Comment count: {descendants}</Card.Subtitle>
						{ text ?
							<Card.Text as='span' className="bold color-dark-grey">
								{parse(text)}
							</Card.Text>
							: <span className='bold color-dark-grey'>To read the text, visit the source</span>}
					</Card.Body>
				</Card>

				<Button onClick={() => updateStoryAndComments(id)} variant="outline-success">Update comments</Button>

				<div className='comments mt-20'>
					{!isEmpty(comments) ? <h6 className='color-dark-grey'>Comments:</h6> : <h6 className='color-grey'>No comments found</h6>}

					{!isEmpty(comments) && comments.map(({id, by, text, time, children, showChildComment}: Comment = {}) =>
						<div className='comment-wrapper mt-20' key={id}>
							{ by && <Card className='parent' border="primary">
								<Card.Body>
									<Card.Subtitle className="mb-2 color-grey"><span className="bold">{by}</span> | {getDateFromTimestamp(time)}</Card.Subtitle>
									<Card.Text className="bold color-dark-grey" as='span'>
										{text && parse(text)}
									</Card.Text>
									{ !isEmpty(children) &&
										<Button onClick={() => changeVisibilityOfChildComment(id)} className="mt-20" variant="outline-secondary">+{children.length} answer{children.length > 1 && 's'}</Button>
									}
								</Card.Body>
							</Card>
							}


							{ (!isEmpty(children) && showChildComment) && children.map(({id, by, text, time} = {}) =>
								<Card key={id} className='child' border="success">
									<Card.Body>
										<Card.Subtitle className="mb-2 color-grey"><span className="bold">{by}</span> | {getDateFromTimestamp(time)}</Card.Subtitle>
										<Card.Text className="bold color-dark-grey" as='span'>
											{text && parse(text)}
										</Card.Text>
									</Card.Body>
								</Card>
							)}
						</div>
					)}
				</div>
			</div>
		</div>);
};