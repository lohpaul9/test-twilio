const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const { createSyncList, createSyncListItem, fetchAllSyncListItems } = require(Runtime.getFunctions()[
  'common/twilio-wrappers/sync'
].path);

const LIST_SID = 'ES7b6c8e07a91a2a4b0f04c5cfcf124cc9';

exports.handler = prepareFlexFunction(async (context, event, response, callback) => {
  try {
    // Extract call details from the event
    // const callDetails = {
    //   // ... your existing logic for callDetails extraction
    // };

    const callDetails = {
      _id: 'd4447cbc-69f3-49cd-b7fa-36059f94080d',
      caller_number: '310-600-2976',
      receiver_number: '301-735-6731',
      call_start: '2023-11-23T21:56:30.332Z',
      call_end: '2023-11-23T22:18:43.892Z',
      agent_name: 'Virginia Okuneva',
      callStatus: 'declined',
    };

    let allItemsResult = await fetchAllSyncListItems({ context, listSid: LIST_SID });

    // Scenario: List doesn't exist
    if (!allItemsResult.success) {
      console.error(`Error fetching all items from the Sync List: ${allItemsResult.message}`);
      await createSyncList({ context });
      if (callDetails && Object.keys(callDetails).length > 0) {
        await createSyncListItem({
          context,
          listSid: LIST_SID,
          itemData: callDetails,
        });
        // Append callDetails to the items list
        allItemsResult.items = [callDetails];
      } else {
        allItemsResult.items = [];
      }
    }
    // Scenario: List exists and there's a new call log
    else if (callDetails && Object.keys(callDetails).length > 0) {
      const newIndex = allItemsResult.items.length;
      await createSyncListItem({
        context,
        listSid: LIST_SID,
        index: newIndex,
        itemData: callDetails,
      });
      // Append callDetails to the items list
      allItemsResult.items.push(callDetails);
    }

    response.setStatusCode(200);
    response.setBody(
      extractStandardResponse({
        success: true,
        logs: allItemsResult.items,
      }),
    );

    return callback(null, response);
  } catch (error) {
    console.error('An error occurred:', error);
    response.setStatusCode(500);
    response.setBody(
      extractStandardResponse({
        success: false,
        message: error.message || 'An unexpected error occurred.',
      }),
    );
    return callback(null, response);
  }
});
