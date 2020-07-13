/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

/**
 * Cloud functions below. Notes: 
 * - Read more about how to organize/export cloud functions here:
 *   https://firebase.google.com/docs/functions/organize-functions
 * - These are background events, basically event listeners
 *   They are guaranteed 'at-least-once execution'
 *   If these functions fail, they will not attempt to retry (currently)
 *   Firebase has native support for enabling retry on failure
 *   This feature will be integrated at some point post-MVP. 
 *   https://cloud.google.com/functions/docs/bestpractices/retries
 */


exports.algolia = require('./algoliaCloudFunctions/devAlgoliaFunctions');


