// @flow

import React, {FC, useEffect, useState, MouseEvent} from 'react';
import {useLocation} from 'react-router-dom';
import {Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import {isEmpty, isNull} from 'lodash';
import './styles.scss';
import type {Story, ID} from '../../types';
import {setStories} from '../../store/stories';
import {ITEM, NEW_STORIES} from '../../api/constants';
import {MINUTE} from '../../constants/time';
import {MAIN_PAGE_PATH} from '../../routing/constants';
import {StoryCard} from '../../components/StoryCard';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';

const STORIES_NUMBER = 100;

export const Main: FC = () => {

	const stories = useAppSelector(state => state.stories.value);
	const dispatch = useAppDispatch();

	const [isLoading, setLoading] = useState<boolean>(stories.length <= 0);

	let location = useLocation();

	let timer: NodeJS.Timeout | undefined;

	useEffect(() => {
		loadStoriesEachMinute();
		return () => clearTimeout(timer);
	}, [location?.pathname]);

	const loadStoriesEachMinute = ():void => {
		loadNewStories();
		timer = setTimeout(loadStoriesEachMinute, MINUTE);
	};

	const loadNewStories = (event?: MouseEvent):void => {

		if (event) {
			setLoading(true);
		}

		axios<ID[]>(NEW_STORIES())
			.then(async ({data}) => {
				const newestStories = [...data.slice(0, STORIES_NUMBER)];
				let loadedStories: Story[] = [];
				const promises = newestStories.map(loadOneStory);

				await Promise.allSettled(promises)
					.then(data =>
						loadedStories = data
							.filter(({status}) => status === 'fulfilled')
							// @ts-ignore
							.map(({value}) => value)
					)
					.finally(() => {
						dispatch(setStories(loadedStories));
						setLoading(false);
					});
			})
			.catch(() => setLoading(false));
	};

	const loadOneStory = (id: ID) => {
		return new Promise((resolve, reject) => {
			axios<Story>(ITEM(id))
				.then(({data}) => !isNull(data) ? resolve(data) : reject())
				.catch(err => reject(err));
		});
	};

	return (
		<div className='main'>
			<div className='content'>
				<div className='header bg-white'>
					<h4 className='color-grey2'>Latest news</h4>
					<Button onClick={(e) => loadNewStories(e)} variant='outline-success'>Update news</Button>
				</div>

				<div className='cards mt-10'>
					{isLoading ? <Spinner animation='border' variant='secondary' className='mt-20' /> :
						(!isEmpty(stories)) ? stories.map((story: Story) =>
							<StoryCard
								story={story}
								key={story.id}
								asLink
								to={`${MAIN_PAGE_PATH}/${story.id}`}
								extraFieldsToShow={[]}
							/>
						) : <h5 className='mt-20'>No stories found :(</h5>
					}
				</div>

			</div>
		</div>);
};