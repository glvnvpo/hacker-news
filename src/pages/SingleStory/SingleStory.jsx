// @flow

import React, { useState, useEffect }  from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from 'axios';
import {ITEM} from "../../api/constants";
import {MAIN_PAGE_PATH} from "../../routing/constants";

export const SingleStory = () => {
	const {id} = useParams();

	const [story, setStory] = useState({});

	const navigate = useNavigate();

	useEffect(()=>{
		loadStory(id);
	}, [id]);

	const loadStory = (id: number | string) => {
		axios(ITEM(id)).then(({data})=>{
			console.log(data);
			setStory(data);
		});
	};

	const goBackToStories = () => {
		navigate(MAIN_PAGE_PATH);
	};

	return (<div>SINGLE STORY PAGE
		<button onClick={()=>goBackToStories()}>Go back to stories</button>
		{story.title}
	</div>);
};