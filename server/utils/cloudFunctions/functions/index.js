/**
 * Description: Turn ad documents into algolia records
 *              With HTTP cloud functions  
 *              Compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

/**
 * Cloud functions below. Notes: 
 * - If contributing additional functions, read the `readme.md`. 
 * - Read more about how to organize/export cloud functions here:
 *   https://firebase.google.com/docs/functions/organize-functions
 * - These are background events, i.e., event listeners
 *   They are guaranteed 'at-least-once execution'
 *   If these functions fail, they will not attempt to retry (currently)
 *   Firebase has native support for enabling retry on failure
 *   This feature will be integrated at some point post-MVP. 
 *   https://cloud.google.com/functions/docs/bestpractices/retries
 * - read `readme.md` for deployment notes. 
 */

// Export dev code for firebase -> algolia code. 
exports.devAlgolia = require('./algoliaCloudFunctions/devAlgoliaFunctions');
exports.prodAlgolia = require('./algoliaCloudFunctions/prodAlgoliaFunctions');

exports.devCountAdvertisers = 
    require('./countAdvertisersCloudFunctions/devCountAdvertisersFunctions');
