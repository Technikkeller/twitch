import { Enumerable } from '@d-fischer/shared-utils';
import { AccessToken } from '../AccessToken';
import { getAppToken } from '../helpers';
import { AuthProvider, AuthProviderTokenType } from './AuthProvider';

/**
 * An auth provider that retrieve tokens using client credentials.
 */
export class ClientCredentialsAuthProvider implements AuthProvider {
	@Enumerable(false) private readonly _clientId: string;
	@Enumerable(false) private readonly _clientSecret: string;
	@Enumerable(false) private _token?: AccessToken;

	/**
	 * The type of tokens this provider generates.
	 *
	 * This auth provider generates app tokens.
	 */
	readonly tokenType: AuthProviderTokenType = 'app';

	/**
	 * Creates a new auth provider to receive an application token with using the client ID and secret.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 */
	constructor(clientId: string, clientSecret: string) {
		this._clientId = clientId;
		this._clientSecret = clientSecret;
	}

	/**
	 * Retrieves an access token.
	 *
	 * If any scopes are provided, this throws. The client credentials flow does not support scopes.
	 *
	 * @param scopes The requested scopes.
	 */
	async getAccessToken(scopes?: string | string[]) {
		if (scopes && scopes.length > 0) {
			throw new Error(
				`Scope ${
					typeof scopes === 'string' ? scopes : scopes.join(',')
				} requested but the client credentials flow does not support scopes`
			);
		}

		if (!this._token || this._token.isExpired) {
			return this.refresh();
		}

		return this._token;
	}

	/**
	 * Retrieves a new app access token.
	 */
	async refresh() {
		return (this._token = await getAppToken(this._clientId, this._clientSecret));
	}

	/** @private */
	setAccessToken(token: AccessToken) {
		this._token = token;
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._clientId;
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	get currentScopes() {
		return [];
	}
}