/**
 * Description: Cloud functions for DEV count advertisers . 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import links to firebase dev databases 
const { DEV_ADS_DOCS } = require('../firebaseConfig');

// Import links to firebase dev advertisers collections
// These are used to write directly to a collection
const { DEV_ADVERTISERS_2018, DEV_ADVERTISERS_2019, DEV_ADVERTISERS_2020 } = 
    require('./countAdvertisersConfig');

// Import helper functions
const { updateAdvertiserCount } = require('./countAdvertisersHelpers');

/**
 * 
 */
exports.devCountAdvertisers = 
  DEV_ADS_DOCS.onWrite((change, context) => {
      if (!change.before.exists) {
        // New document created: increment field value by one

        updateAdvertiserCount(change, /* isIncrement= */ true);
      } else if (change.before.exists && change.after.exists) {
        // Updating existing document: do nothing

      } else if (!change.after.exists) {
        // Deleting document: decrement field value by one

        updateAdvertiserCount(change, /* isIncrement= */ false);
      }
    });


