// @flow

import React, {FC, HTMLAttributes} from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import {isEmpty} from 'lodash';
import parse from 'html-react-parser';
import './styles.scss';
import {Spinner} from '../Spinner';
import {Story} from '../../types';
import {getDateFromTimestamp} from '../../helpers/get-date-from-timestamp';

export enum Fields {
	ALL= 'all',
	URL = 'url',
	TEXT = 'text'
}

type Props = {
    story: Story | undefined;
    isLoading?: boolean;
	asLink?: boolean;
	to?: string;
	extraFieldsToShow?: Array<Fields>;
}

export const StoryCard: FC<Props & HTMLAttributes<any>> = ({story, isLoading=false, asLink=false, to,
															   extraFieldsToShow=[Fields.ALL], ...rest}) => {

	let {title, score, by, time, url, text, descendants} = story || {};

	const shouldShowField = (key: Fields): boolean => {
		if (extraFieldsToShow.includes(Fields.ALL)) {
			return true;
		}

		return extraFieldsToShow.includes(key);
	};

	return (
		<Card
			className='story mt-10 mb-20'
			as={asLink ? Link : undefined}
			to={to || ''}
			{...rest}
		>
			{
				isLoading ? <Spinner className='mt-20 mb-20' /> :
					!isEmpty(story) ?
						<Card.Body>
							<Card.Title className='color-orange'>{title}</Card.Title>
							<Card.Subtitle className='mb-2 color-grey'>{score}&nbsp;points&nbsp;| {by}&nbsp;| {getDateFromTimestamp(time)}</Card.Subtitle>

							{
								shouldShowField(Fields.URL) &&
								<Card.Subtitle className='url mb-2 color-grey'>
									{url ? <a href={url} target='_blank' rel='noreferrer'>Source</a> : 'No source link available'}
								</Card.Subtitle>
							}

							<Card.Subtitle className='comments-count mb-2 color-grey'>Comments count: {descendants}</Card.Subtitle>

							{
								shouldShowField(Fields.TEXT) &&
								(text ?
									<Card.Text as='span' className='bold color-dark-grey'>
										{parse(text)}
									</Card.Text>
									: <span className='bold color-dark-grey'>To read the text, visit the source</span>)
							}
						</Card.Body>
						: <h6 className='error mt-20 mb-20'>Some troubles in loading story</h6>
			}
		</Card>
	);
};