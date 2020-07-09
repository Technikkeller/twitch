import { HelixResponse, HelixSubscriptionEvent } from 'twitch';
import { HelixSubscriptionEventData } from 'twitch/lib/API/Helix/Subscriptions/HelixSubscriptionEvent';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @private
 */
export default class SubscriptionEventSubscription extends Subscription<HelixSubscriptionEvent> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixSubscriptionEvent) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `subscription.event.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixSubscriptionEventData>) {
		return new HelixSubscriptionEvent(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToSubscriptionEvents(
			this._userId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromSubscriptionEvents(
			this._userId,
			await this._getOptions()
		);
	}
}
