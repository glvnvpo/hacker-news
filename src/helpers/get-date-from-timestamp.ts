// @flow

export const getDateFromTimestamp = (timestamp: string | number | undefined): string => {
	const date = new Date(Number(timestamp) * 1000);

	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
};