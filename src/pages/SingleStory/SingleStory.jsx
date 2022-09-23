// @flow

import React, { useState, useEffect }  from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import axios from 'axios';
import {isEmpty, isNull} from "lodash";
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
}

type Comment = {
	id: number | string;
	by: string;
	text: string;
	time: number | string;
	kids?: Array<number | string>;
	children?: Array<Comment>;
}

export const SingleStory = () => {
	const {id} = useParams();

	const [story, setStory] = useState({});
	const [comments, setComments] = useState([]);

	const navigate = useNavigate();
	let location = useLocation();

	let timer;

	useEffect(()=>{
		updateStoryAndCommentsEachMinute(id);
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStory = (id: number | string) => {
		return new Promise((resolve)=> {
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

	const loadChildrenComments = (comment: Comment) => {
		const {id, kids} = comment || {};

		return new Promise((resolve) => {
			if (id && kids && !isEmpty(kids)) {
				const promises = kids.map(loadOneComment);
				Promise.all(promises)
					.then(childrenComm =>
						resolve({...comment, children: childrenComm})
					);
			}
			else resolve(comment);
		});
	};

	const loadOneComment = (id: string | number) => {
		return new Promise((resolve, reject)=> {
			axios(ITEM(id))
				.then(({data}) => !isNull(data) && resolve(data))
				.catch(err => reject(err));
		});
	};

	return (
		<div>SINGLE STORY PAGE
			<button onClick={()=>goBackToStories()}>Go back to stories</button>
			{story.title}
			<button onClick={() => updateStoryAndComments(id)} >Update comments </button>
			{!isEmpty(comments) && comments.map(({id, by, text, time, children}: Comment) =>
				<div key={id}><span onClick={()=>{}}><b>{by}</b>{getDateFromTimestamp(time)} {text}</span>
					<button onClick={()=>loadChildrenComments(id, kids)}>Download children comments</button>
					<div> <b>Children comments:</b></div>
					{!isEmpty(children) && children.map(({id, by, text, time}) => <div key={id} style={{background: 'lightpink'}}><b>{by}</b> {getDateFromTimestamp(time)} {text}</div> )}
				</div>
			)}
		</div>);
};