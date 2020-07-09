import TwitchClient from '../src/index';
type FetchMock = typeof import('fetch-mock');

// Enabling require for one line as there are no type definitions avaivable for fetch-mock-jest
// TODO: @low Adding type definitions for fetch-mock-jest

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../node_modules/node-fetch', () => require('fetch-mock-jest').sandbox());
import nodeFetch from 'node-fetch';
const fetchMock = (nodeFetch as unknown) as FetchMock;

describe('get access tokens', () => {
	afterEach(() => {
		fetchMock.restore();
		fetchMock.reset();
	});

	it('with client credentials', async () => {
		fetchMock.mock(
			{ url: 'express:/oauth2/token', method: 'POST' },
			{
				status: 200,
				body: {
					access_token: 'abcdefghijklmnopqrstuvwxyzABCD',
					refresh_token: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn',
					expires_in: 5000
				}
			}
		);

		expect(await TwitchClient.getAppAccessToken('clientID', 'clientSecret')).toEqual(
			expect.objectContaining({
				_data: expect.objectContaining({
					access_token: 'abcdefghijklmnopqrstuvwxyzABCD',
					refresh_token: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn',
					expires_in: 5000
				}),
				_obtainmentDate: expect.any(Date)
			})
		);
	});
});
