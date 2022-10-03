// @flow

import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {Card, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import {isEmpty, isNull} from 'lodash';
import './styles.scss';
import {setStories} from '../../store/stories';
import {ITEM, NEW_STORIES} from "../../api/constants";
import {MINUTE} from "../../constants/time";
import {MAIN_PAGE_PATH} from '../../routing/constants';
import {getDateFromTimestamp} from "../../helpers/get-date-from-timestamp";

type Story = {
    id: number | string;
    title: string;
    by: string;
    time: number | string;
    score: number | string;
	kids?: Array<number | string>;
}

const STORIES_NUMBER = 100;

export const Main = () => {

	const stories = useSelector(state => state.stories.value);
	const dispatch = useDispatch();

	const [isLoading, setLoading] = useState(stories.length <= 0);

	let location = useLocation();

	let timer;

	useEffect(() => {
		loadStoriesEachMinute();
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStoriesEachMinute = () => {
		loadNewStories();
		timer = setTimeout(loadStoriesEachMinute, MINUTE);
	};

	const loadNewStories = (event = undefined) => {

		if (event) {
			setLoading(true);
		}

		axios(NEW_STORIES())
			.then(async ({data}) => {
				const newestStories = [...data.slice(0, STORIES_NUMBER)];
				let loadedStories = [];
				const promises = newestStories.map(loadOneStory);
				await Promise.allSettled(promises)
					.then(data =>
						loadedStories = data
							.filter(({status})=> status === 'fulfilled')
							.map(({value}) => value)
					)
					.finally(() => {
						dispatch(setStories(loadedStories));
						setLoading(false);
					});
			})
			.catch((err) => console.error(err));
	};

	const loadOneStory = (id: string | number) => {
		return new Promise((resolve, reject)=> {
			axios(ITEM(id))
				.then(({data}) => !isNull(data) ? resolve(data) : reject())
				.catch(err => reject(err));
		});
	};

	return (
		<div className="main">
			<div className='content'>
				<div className='header bg-white'>
					<h4 className="color-grey2">Latest news</h4>
					<Button onClick={(e) => loadNewStories(e)} variant="outline-success">Update news</Button>
				</div>

				<div className='cards mt-10'>
					{isLoading ? <Spinner animation="border" variant="secondary" className="mt-20" /> :
						(!isEmpty(stories)) ? stories.map(({id, title, by, time, score}: Story)=>
							<Card
								key={id}
								as={Link}
								to={`${MAIN_PAGE_PATH}/${id}`}
								className='mb-10'
							>
								<Card.Body>
									<Card.Title className="color-orange">{title}</Card.Title>
									<Card.Subtitle className="mb-2 color-grey">{score} points | {by} | {getDateFromTimestamp(time)}</Card.Subtitle>
								</Card.Body>
							</Card>
						) : <h5 className="mt-20">No stories found</h5>}
				</div>

			</div>
		</div>);
};