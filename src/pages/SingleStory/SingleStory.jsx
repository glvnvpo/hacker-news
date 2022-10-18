// @flow

import React, {useState, useEffect}  from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {Button} from "react-bootstrap";
import axios from 'axios';
import {isEmpty, isNull} from "lodash";
import './styles.scss';
import type {Story, Comment, ChildComment} from '../../types';
import {ITEM} from "../../api/constants";
import {MINUTE} from "../../constants/time";
import {MAIN_PAGE_PATH} from "../../routing/constants";
import {Spinner} from "../../components/Spinner";
import {StoryCard} from "../../components/StoryCard";
import {CommentCard} from "../../components/CommentCard";

export const SingleStory = () => {
	const {id} = useParams();

	const [story, setStory] = useState({});
	const [comments, setComments] = useState([]);
	const [isStoryLoading, setStoryLoading] = useState(true);
	const [isCommentsLoading, setCommentsLoading] = useState(true);

	const navigate = useNavigate();
	let location = useLocation();

	let timer;

	useEffect(() => {
		updateStoryAndCommentsEachMinute(id);
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStory = (id: number | string): Promise<Story | string> => {
		return new Promise((resolve, reject) => {
			axios(ITEM(id))
				.then(({data}) => {
					if (data) {
						setStory(data);
						resolve(data);
					}
					else {
						setStory({});
						reject('No data');
					}
				})
				.catch((err) => reject(err))
				.finally(() => setStoryLoading(false));
		});
	};

	const updateStoryAndComments = (id: number | string, event = undefined) => {
		if (event) {
			setCommentsLoading(true);
		}

		loadStory(id)
			.then((data) => loadComments(data))
			.catch(() => setCommentsLoading(false));
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

			Promise.allSettled(promises)
				.then(data => {
					const loadedComments = data
						.filter(({status})=> status === 'fulfilled')
						.map(({value}) => value);
					const childrenPromises = loadedComments.map(loadChildrenComments);
					return Promise.all(childrenPromises);
				})
				.then((loadedComments) => {
					setComments(prevComments => {
						if (!isEmpty(prevComments)) {
							return loadedComments.map(comment => {
								const existingComment = prevComments.find(el => el.id === comment.id);
								return {
									...comment,
									showChildComment: existingComment ? existingComment.showChildComment : false
								};
							});
						}
						else return loadedComments;
					});
				})
				.finally(() => setCommentsLoading(false));
		}
		else {
			setCommentsLoading(false);
		}
	};

	const loadChildrenComments = (comment: Comment): Promise<Comment> => {
		const {id, kids} = comment || {};

		return new Promise((resolve) => {
			if (id && kids && !isEmpty(kids)) {
				const promises = kids.map(loadOneComment);
				Promise.allSettled(promises)
					.then(data => {
						const loadedChildrenComments = data
							.filter(({status}) => status === 'fulfilled')
							.map(({value}) => value);

						resolve({...comment,
							children: loadedChildrenComments
						});
					});
			}
			else resolve(comment);
		});
	};

	const loadOneComment = (id: string | number): Promise<Comment | string> => {
		return new Promise((resolve, reject) => {
			axios(ITEM(id))
				.then(({data}) => !isNull(data) ? resolve(data) : reject('No data'))
				.catch(err => reject(err));
		});
	};

	const changeVisibilityOfChildComment = (parentId: number | string): Array<Comment> => {
		setComments(prevComments => {
			const parentComment = prevComments.find(({id}) => parentId === id);
			const newVisibility = !parentComment.showChildComment;
			return prevComments.map(
				comment => comment.id === parentId ?
					{...parentComment, showChildComment: newVisibility}
					: comment
			);
		});
	};

	return (
		<div className="single-story">
			<div className='content'>

				<Button className="mt-20 mb-10" onClick={() => goBackToStories()} variant="outline-primary">Go back to news</Button>

				<StoryCard isLoading={isStoryLoading} story={story} />

				{
					!isEmpty(story) &&
					<Button onClick={(e) => updateStoryAndComments(id, e)} variant="outline-success">Update comments</Button>
				}

				<div className='comments mt-20 mb-20'>

					{ (!isEmpty(story) && !isCommentsLoading) &&
					(!isEmpty(comments) ? <h6 className='color-dark-grey'>Comments:</h6>
						: <h6 className='color-grey'>No comments found</h6>)
					}

					{ (isCommentsLoading && !isStoryLoading) ? <Spinner className="mt-20" /> :
						!isEmpty(comments) && comments.map((comment: Comment = {}) =>
							<div className='comment-wrapper mt-20' key={comment.id}>
								{ comment.by &&
									<CommentCard
										comment={comment}
										onChangeVisibilityOfChildComment={changeVisibilityOfChildComment}
									/>
								}

								{ (!isEmpty(comment.children) && comment.showChildComment) && comment.children.map((childComment: ChildComment) =>
									<CommentCard
										comment={childComment}
										parent={false}
										key={childComment.id}
									/>
								)}
							</div>
						)}
				</div>
			</div>
		</div>);
};