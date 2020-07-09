import { HelixBanEvent, HelixResponse } from 'twitch';
import { HelixBanEventData } from 'twitch/lib/API/Helix/Moderation/HelixBanEvent';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @private
 */
export default class BanEventSubscription extends Subscription<HelixBanEvent> {
	constructor(
		private readonly _broadcasterId: string,
		handler: (data: HelixBanEvent) => void,
		client: WebHookListener,
		private readonly _userId?: string,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		if (this._userId) {
			return `ban.event.${this._broadcasterId}.${this._userId}`;
		}
		return `ban.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixBanEventData>) {
		return new HelixBanEvent(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.subscribeToBanEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._twitchClient.helix.webHooks.subscribeToBanEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.unsubscribeFromBanEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._twitchClient.helix.webHooks.unsubscribeFromBanEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
