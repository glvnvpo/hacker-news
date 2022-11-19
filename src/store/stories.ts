// @flow

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Story} from '../types';

interface StoriesState {
	value: Story[]
}

const initialState: StoriesState = {
	value: []
};

export const storiesSlice = createSlice({
	name: 'stories',
	initialState,
	reducers: {
		setStories: (state, action: PayloadAction<Story[]>) => {
			state.value = action.payload;
		}
	}
});

export const {setStories} = storiesSlice.actions;

export default storiesSlice.reducer;