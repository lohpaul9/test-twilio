const { isString, isObject, isNumber } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @returns {object} success
 * @description the following method is used to remove a Sync Map Item
 */
exports.deleteMapItem = async function deleteMapItem(parameters) {
  const { context, mapSid, key } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(mapSid) && !isString(mapSid))
    throw new Error('Invalid parameters object passed. Parameters must contain mapSid string value');
  if (Boolean(key) && !isString(key))
    throw new Error('Invalid parameters object passed. Parameters must contain key string value');

  try {
    const client = context.getTwilioClient();

    await client.sync.services(context.TWILIO_FLEX_SYNC_SID).syncMaps(mapSid).syncMapItems(key).remove();

    return { success: true, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.deleteMapItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @returns {object} An existing Sync Map Item
 * @description the following method is used to fetch a Sync Map Item
 */
exports.fetchMapItem = async function fetchMapItem(parameters) {
  const { context, mapSid, key } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(mapSid) && !isString(mapSid))
    throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(key) && !isString(key))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string value');

  try {
    const client = context.getTwilioClient();

    const mapItem = await client.sync.v1
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncMaps(mapSid)
      .syncMapItems(key)
      .fetch();

    return { success: true, status: 200, mapItem };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchMapItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @param {number} parameters.ttl how long (in seconds) before the Sync item expires and is deleted (optional)
 * @param {object} parameters.data schema-less object that the Sync Map item stores - 16 KiB max (optional)
 * @returns {object} A new Sync Map Item
 * @description the following method is used to create a Sync Map Item
 */
exports.createMapItem = async function createMapItem(parameters) {
  const { context, mapSid, key, ttl, data } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(mapSid) && !isString(mapSid))
    throw new Error('Invalid parameters object passed. Parameters must contain mapSid string value');
  if (Boolean(key) && !isString(key))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string value');
  if (Boolean(ttl) && !isString(ttl))
    throw new Error('Invalid parameters object passed. Parameters must contain ttl integer value');
  if (Boolean(data) && !isObject(data))
    throw new Error('Invalid parameters object passed. Parameters must contain data object');

  try {
    const client = context.getTwilioClient();
    const mapItemParameters = {
      key,
      ttl,
      data,
    };

    const mapItem = await client.sync.v1
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncMaps(mapSid)
      .syncMapItems.create(mapItemParameters);

    return { success: true, status: 200, mapItem };
  } catch (error) {
    return retryHandler(error, parameters, exports.createMapItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName the unique name of the Sync document (optional)
 * @param {number} parameters.ttl how long (in seconds) before the Sync Document expires and is deleted (optional)
 * @param {object} parameters.data schema-less object that the Sync Document stores - 16 KiB max (optional)
 * @returns {object} A new Sync document
 * @description the following method is used to create a sync document
 */
exports.createDocument = async function createDocument(parameters) {
  const { context, uniqueName, ttl, data } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(uniqueName) && !isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string value');
  if (Boolean(ttl) && !isString(ttl))
    throw new Error('Invalid parameters object passed. Parameters must contain ttl integer value');
  if (Boolean(data) && !isObject(data))
    throw new Error('Invalid parameters object passed. Parameters must contain data object');

  try {
    const client = context.getTwilioClient();
    const documentParameters = {
      uniqueName,
      ttl,
      data,
    };

    const document = await client.sync.v1.services(context.TWILIO_FLEX_SYNC_SID).documents.create(documentParameters);

    return { success: true, status: 200, document };
  } catch (error) {
    return retryHandler(error, parameters, exports.createDocument);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.documentSid the sid of the Sync document
 * @param {string} parameters.uniqueName the uniqueName of the Sync document
 * @returns {object} A Sync document
 * @description the following method is used to fetch a sync document
 */
exports.fetchDocument = async function fetchDocument(parameters) {
  const { context, documentSid, uniqueName } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(documentSid) && !isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain documentSid string value');

  try {
    const client = context.getTwilioClient();
    const sync_service = await client.sync.v1.services(context.TWILIO_FLEX_SYNC_SID);

    let document;
    if (uniqueName) {
      document = await sync_service.documents(uniqueName).fetch();
    } else {
      document = await sync_service.documents(documentSid).fetch();
    }

    return { success: true, status: 200, document };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchDocument);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.documentSid the sid of the Sync document
 * @param {object} parameters.updateData the data object to update on the Sync document
 * @returns {object} A Sync document
 * @description the following method is used to fetch a sync document
 */
exports.updateDocumentData = async function updateDocumentData(parameters) {
  const { context, documentSid, updateData } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(documentSid))
    throw new Error('Invalid parameters object passed. Parameters must contain documentSid string value');
  if (!isObject(updateData))
    throw new Error('Invalid parameters object passed. Parameters must contain updateData object');

  try {
    const client = context.getTwilioClient();

    const documentUpdate = await client.sync.v1
      .services(context.TWILIO_FLEX_SYNC_SID)
      .documents(documentSid)
      .update({ data: updateData });

    return { success: true, status: 200, document: documentUpdate };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateDocumentData);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} A Sync list
 * @description the following method is used to create a sync list
 */
exports.createSyncList = async function createSyncList(parameters) {
  const { context } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();

    const syncList = await client.sync.v1.services(context.TWILIO_FLEX_SYNC_SID).syncLists.create();

    return { success: true, status: 200, syncList };
  } catch (error) {
    return retryHandler(error, parameters, exports.createSyncList);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @returns {object} A Sync list
 * @description the following method is used to fetch a sync list
 */
exports.fetchSyncList = async function fetchSyncList(parameters) {
  const { context, listSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');

  try {
    const client = context.getTwilioClient();

    const syncList = await client.sync.v1.services(context.TWILIO_FLEX_SYNC_SID).syncLists(listSid).fetch();

    return { success: true, status: 200, syncList };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchSyncList);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @param {number} parameters.ttl how long (in seconds) before the Sync list expires and is deleted (optional)
 * @returns {object} A Sync list
 * @description the following method is used to update a sync list
 */
exports.updateSyncList = async function updateSyncList(parameters) {
  const { context, listSid, ttl } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(listSid) && !isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');
  if (Boolean(ttl) && !isString(ttl))
    throw new Error('Invalid parameters object passed. Parameters must contain ttl integer value');

  try {
    const client = context.getTwilioClient();

    const syncList = await client.sync.v1
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncLists(listSid)
      .update({ ttl: ttl });

    return { success: true, status: 200, syncList };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateSyncList);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @param {object} parameters.itemData the data object to be created on the Sync list
 * @returns {object} A Sync list item
 * @description the following method is used to create an item in the sync list
 */
exports.createSyncListItem = async function createSyncListItem(parameters) {
  const { context, listSid, itemData } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');
  if (!isObject(itemData)) throw new Error('Invalid parameters object passed. Parameters must contain itemData object');

  try {
    const client = context.getTwilioClient();
    const listItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncLists(listSid)
      .syncListItems.create({ data: itemData });
    return { success: true, status: 200, listItem };
  } catch (error) {
    return retryHandler(error, parameters, exports.createSyncListItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @param {number} parameters.index the index of the data to be fetched from the sync list
 * @returns {object} A Sync list item
 * @description the following method is used to fetch an item from the sync list
 */
exports.fetchSyncListItem = async function fetchSyncListItem(parameters) {
  const { context, listSid, index } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (Boolean(listSid) && !isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');
  if (Boolean(index) && !isString(index))
    throw new Error('Invalid parameters object passed. Parameters must contain index integer value');

  try {
    const client = context.getTwilioClient();
    const listItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncLists(listSid)
      .syncListItems(index)
      .fetch();
    return { success: true, status: 200, listItem };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchSyncListItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @param {number} parameters.index the index of the item to be updated
 * @param {object} parameters.itemUpdateData the data object to be updated on the Sync list
 * @returns {object} A Sync list item
 * @description the following method is used to update an item in the sync list
 */
exports.updateSyncListItem = async function updateSyncListItem(parameters) {
  const { context, listSid, index, itemUpdateData } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');
  if (Boolean(index) && !isString(index))
    throw new Error('Invalid parameters object passed. Parameters must contain index integer value');
  if (!isObject(itemUpdateData))
    throw new Error('Invalid parameters object passed.Parameters must contain itemUpdateData object');

  try {
    const client = context.getTwilioClient();
    const listItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncLists(listSid)
      .syncListItems(index)
      .update({ data: itemUpdateData });
    return { success: true, status: 200, listItem };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateSyncListItem);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.listSid the sid of the sync list
 * @returns {Array<object>} An array of Sync list items
 * @description This method fetches all items in the specified sync list.
 */
exports.fetchAllSyncListItems = async function fetchAllSyncListItems(parameters) {
  const { context, listSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(listSid))
    throw new Error('Invalid parameters object passed. Parameters must contain listSid string value');

  try {
    const client = context.getTwilioClient();
    const syncListItems = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncLists(listSid)
      .syncListItems.list({ limit: 20 });

    // You can extract or format the data as needed before returning it
    return {
      success: true,
      status: 200,
      items: syncListItems.map((item) => ({ index: item.index, data: item.data })),
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchAllSyncListItems);
  }
};
