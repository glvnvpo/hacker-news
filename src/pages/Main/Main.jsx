// @flow

import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import {Card, Button} from 'react-bootstrap';
import axios from 'axios';
import {isEmpty, isNull} from 'lodash';
import './styles.scss';
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

	const [stories, setStories] = useState([]);

	let location = useLocation();

	let timer;

	useEffect(()=>{
		loadStoriesEachMinute();
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStoriesEachMinute = () => {
		loadNewStories();
		timer = setTimeout(loadStoriesEachMinute, MINUTE);
	};

	const loadNewStories = () =>{
		axios(NEW_STORIES())
			.then(async ({data}) => {
				const newestStories = [...data.slice(0, STORIES_NUMBER)];
				let loadedStories = [];
				const promises = newestStories.map(loadOneStory);
				await Promise.all(promises)
					.then(story => loadedStories.push(...story))
					.finally(() => setStories(loadedStories));
			})
			.catch((err) => console.error(err));
	};

	const loadOneStory = (id: string | number) => {
		return new Promise((resolve, reject)=> {
			axios(ITEM(id))
				.then(({data}) => !isNull(data) && resolve(data))
				.catch(err => reject(err));
		});
	};

	return (
		<div className="main">
            MAIN PAGE
			<Button onClick={() => loadNewStories()} variant="outline-success">Update stories</Button>
			{!isEmpty(stories) ? stories.map(({id, title, by, time, score}: Story)=>
				<Card
					key={id}
					style={{ width: '50rem' }}
					className="card"
					as={Link}
					to={`${MAIN_PAGE_PATH}/${id}`}
				>
					<Card.Header>{title}</Card.Header>
					<Card.Body>
						<Card.Subtitle className="mb-2 text-muted">{getDateFromTimestamp(time)}</Card.Subtitle>
						<Card.Subtitle className="mb-2 text-muted">{by}</Card.Subtitle>
						<Card.Subtitle className="mb-2 text-muted">{score} points</Card.Subtitle>

					</Card.Body>
				</Card>
			) : 'EMPTY'}

		</div>);
};