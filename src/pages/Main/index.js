// @flow

import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {isEmpty} from 'lodash';
import {ITEM, NEW_STORIES} from "../../api/constants";
import {MAIN_PAGE_PATH} from '../../routing/constants';

type Story = {
	id: number | string;
	title: string;
	by: string;
	time: number | string;
	score: number | string;
}

const STORIES_NUMBER = 100;

export const Main = () => {

	const [stories, setStories] = useState([]);

	useEffect(()=>{
		loadNewStories();
	}, []);


	const loadNewStories = () =>{
		axios(NEW_STORIES())
			.then(async ({data}) => {
				const newestStories =[...data.slice(0, STORIES_NUMBER)];
				let arr = [];
				const promises = newestStories.map(loadOneStory);
				await Promise.all(promises)
					.then(p=> arr.push(...p))
					.finally(()=> setStories(arr));
			})
			.catch((err) => console.err(err));
	};

	const loadOneStory = (id: string | number) => {
		return new Promise((resolve, reject)=> {
			axios(ITEM(id))
				.then(({data}) => resolve(data))
				.catch(err => reject(err));
		});
	};

	return (
		<div>
		MAIN PAGE
			{!isEmpty(stories) ? stories.map(({id, title, by, time, score}: Story)=>
				<Link key={id} to={`${MAIN_PAGE_PATH}/${id}`}><li>{title}</li></Link>
			) : 'EMPTY'}
		</div>);
};