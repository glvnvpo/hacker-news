// @flow

import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from 'axios';
import {isEmpty, isNull} from 'lodash';
import {ITEM, NEW_STORIES} from "../../api/constants";
import {MINUTE} from "../../constants/time";
import {MAIN_PAGE_PATH} from '../../routing/constants';

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
		<div>
            MAIN PAGE
			<button onClick={() => loadNewStories()}>Update stories</button>
			{!isEmpty(stories) ? stories.map(({id, title, by, time, score}: Story)=>
				<Link key={id} to={`${MAIN_PAGE_PATH}/${id}`}><li>{title}</li></Link>
			) : 'EMPTY'}
		</div>);
};