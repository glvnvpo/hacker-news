// @flow

import {ID, URL} from '../types';

const BASE = 'https://hacker-news.firebaseio.com/v0';

export const NEW_STORIES = (): URL => `${BASE}/newstories.json`;
export const ITEM = (id: ID): URL => `${BASE}/item/${id}.json`;