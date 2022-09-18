// @flow

import React, { useState, useEffect }  from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';
import {ITEM} from "../../api/constants";

type Props = {

}

export const SingleStory = (props: Props) => {
	const {id} = useParams();

	const [story, setStory] = useState({});
	
	useEffect(()=>{
		console.log('on mount single');
		loadStory(id);
	}, [id]);

	const loadStory = (id: number | string) => {
		axios(ITEM(id)).then(({data})=>{
			console.log(data);
			setStory(data);
		});
	};

	return (<div>SINGLE STORY PAGE {story.title}</div>);
};