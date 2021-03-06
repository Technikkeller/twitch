import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { User, UserData } from '../User/User';

/** @private */
export interface ChannelFollowData {
	created_at: string;
	notifications: boolean;
	user: UserData;
}

/**
 * A relation of a user following a previously given channel.
 */
export class ChannelFollow {
	/** @private */
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: ChannelFollowData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The user following the given channel.
	 */
	get user() {
		return new User(this._data.user, this._client);
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications() {
		return this._data.notifications;
	}

	/**
	 * The date when the user followed.
	 */
	get followDate() {
		return new Date(this._data.created_at);
	}
}
