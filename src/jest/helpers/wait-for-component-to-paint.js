import {act} from 'react-dom/test-utils';

export const waitForComponentToPaint = async () => {
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});
};