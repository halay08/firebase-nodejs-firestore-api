import { injectable } from 'inversify';
import { fireauth, BaseAuth } from './types';

/**
 * The Firebase Auth adapter.
 */
@injectable()
export default class FireAuth extends BaseAuth implements fireauth.IAuth {
    /**
     * Creates a new user.
     *
     * See [Create a user](/docs/auth/admin/manage-users#create_a_user) for code
     * samples and detailed documentation.
     *
     * @param properties The properties to set on the
     *   new user record to be created.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the newly created user.
     */
    public async createUser(properties: fireauth.ICreateRequest): Promise<fireauth.IUserRecord> {
        return await this.auth.createUser(properties);
    }

    /**
     * Creates a new Firebase custom token (JWT) that can be sent back to a client
     * device to use to sign in with the client SDKs' `signInWithCustomToken()`
     * methods. (Tenant-aware instances will also embed the tenant ID in the
     * token.)
     *
     * See [Create Custom Tokens](/docs/auth/admin/create-custom-tokens) for code
     * samples and detailed documentation.
     *
     * @param uid The `uid` to use as the custom token's subject.
     * @param developerClaims Optional additional claims to include
     *   in the custom token's payload.
     *
     * @return A promise fulfilled with a custom token for the
     *   provided `uid` and payload.
     */
    public async createCustomToken(uid: string, developerClaims?: object): Promise<string> {
        return await this.auth.createCustomToken(uid, developerClaims);
    }

    /**
     * Verifies a Firebase ID token (JWT). If the token is valid, the promise is
     * fulfilled with the token's decoded claims; otherwise, the promise is
     * rejected.
     * An optional flag can be passed to additionally check whether the ID token
     * was revoked.
     *
     * See [Verify ID Tokens](/docs/auth/admin/verify-id-tokens) for code samples
     * and detailed documentation.
     *
     * @param idToken The ID token to verify.
     * @param checkRevoked Whether to check if the ID token was revoked.
     *   This requires an extra request to the Firebase Auth backend to check
     *   the `tokensValidAfterTime` time for the corresponding user.
     *   When not specified, this additional check is not applied.
     *
     * @return A promise fulfilled with the
     *   token's decoded claims if the ID token is valid; otherwise, a rejected
     *   promise.
     */
    public async verifyIdToken(token: string): Promise<fireauth.IDecodedIdToken> {
        return await this.auth.verifyIdToken(token);
    }

    /**
     * Sets additional developer claims on an existing user identified by the
     * provided `uid`, typically used to define user roles and levels of
     * access. These claims should propagate to all devices where the user is
     * already signed in (after token expiration or when token refresh is forced)
     * and the next time the user signs in. If a reserved OIDC claim name
     * is used (sub, iat, iss, etc), an error is thrown. They are set on the
     * authenticated user's ID token JWT.
     *
     * See
     * [Defining user roles and access levels](/docs/auth/admin/custom-claims)
     * for code samples and detailed documentation.
     *
     * @param uid The `uid` of the user to edit.
     * @param customUserClaims The developer claims to set. If null is
     *   passed, existing custom claims are deleted. Passing a custom claims payload
     *   larger than 1000 bytes will throw an error. Custom claims are added to the
     *   user's ID token which is transmitted on every authenticated request.
     *   For profile non-access related user attributes, use database or other
     *   separate storage systems.
     * @return A promise that resolves when the operation completes
     *   successfully.
     */
    public async setCustomUserClaims(uid: string, role: object): Promise<void> {
        return await this.auth.setCustomUserClaims(uid, role);
    }

    /**
     * Gets the user data for the user corresponding to a given `uid`.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param uid The `uid` corresponding to the user whose data to fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided `uid`.
     */
    public async getUser(uid: string): Promise<fireauth.IUserRecord> {
        return await this.auth.getUser(uid);
    }

    /**
     * Gets the user data for the user corresponding to a given email.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param email The email corresponding to the user whose data to
     *   fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided email.
     */
    public async getUserByEmail(email: string): Promise<fireauth.IUserRecord> {
        return this.auth.getUserByEmail(email);
    }

    /**
     * Gets the user data for the user corresponding to a given phone number. The
     * phone number has to conform to the E.164 specification.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param phoneNumber The phone number corresponding to the user whose
     *   data to fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided phone number.
     */
    public async getUserByPhoneNumber(phoneNumber: string): Promise<fireauth.IUserRecord> {
        return this.auth.getUserByPhoneNumber(phoneNumber);
    }

    /**
     * Retrieves a list of users (single batch only) with a size of `maxResults`
     * starting from the offset as specified by `pageToken`. This is used to
     * retrieve all the users of a specified project in batches.
     *
     * See [List all users](/docs/auth/admin/manage-users#list_all_users)
     * for code samples and detailed documentation.
     *
     * @param maxResults The page size, 1000 if undefined. This is also
     *   the maximum allowed limit.
     * @param pageToken The next page token. If not specified, returns
     *   users starting without any offset.
     * @return A promise that resolves with
     *   the current batch of downloaded users and the next page token.
     */
    public async listUsers(maxResults?: number, pageToken?: string): Promise<fireauth.IListUsersResult> {
        return this.auth.listUsers(maxResults, pageToken);
    }

    /**
     * Updates an existing user.
     *
     * See [Update a user](/docs/auth/admin/manage-users#update_a_user) for code
     * samples and detailed documentation.
     *
     * @param uid The `uid` corresponding to the user to delete.
     * @param properties The properties to update on
     *   the provided user.
     *
     * @return A promise fulfilled with the
     *   updated user data.
     */
    public async updateUser(uid: string, properties: fireauth.IUpdateRequest): Promise<fireauth.IUserRecord> {
        return this.auth.updateUser(uid, properties);
    }
}
