const Promise = require('bluebird');
const apiUtils = require('./api-utils');
const constants = require('./constants');

/**
 * Base class for a Zendesk uploader
 * Creates a zendesk api client instance, or can optionally be passed an existing client
 * Also handles metadata that is common to all Uploaders
 * @property {object} meta - contains metadata about the document
 */
module.exports = class Uploader {
    /**
     * Creates an Uploader
     * @param {Object} document - document object containing metadata
     * @param {Object} [zendeskClient] - optional instance of the node-zendesk api client
     * @throws {Error} Will throw an error if the environment variables for the api client are not set
     */
    constructor(document, zendeskClient) {
        this._client = zendeskClient || apiUtils.getClient();
        this._document = document;
        this._meta = document.meta;
    }

    /**
     * Creates the item on Zendesk in sub-classes
     * @returns {Promise}
     */
    create() {
        return Promise.resolve();
    }

    /**
     * Syncs data to the Zendesk API in sub-classes
     * @returns {Promise} fulfills promise with boolean indicating whether the content has changed since the last sync
     */
    sync() {
        return Promise.resolve(this._document.isChanged);
    }

    _buildCreateRequest() {
        return {
            [constants.LOCALE]: this._meta.locale
        };
    }

    _buildUpdateRequest() {
        return {
            [constants.POSITION]: this._meta.position
        };
    }

    _buildTranslationUpdateRequest() {
        return {
            [constants.TRANSLATIONS.TITLE]: this._meta.title,
            [constants.LOCALE]: this._meta.locale
        };
    }

    _setReturnedMetadata(result) {
        this._meta.update({zendeskId: result[constants.ID]});
        return this._meta.write();
    }

    get meta() {
        return this._meta;
    }
};
