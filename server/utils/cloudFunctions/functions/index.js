/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

const algoliaFunctions = require('./algoliaCloudFunctions/algoliaFunctions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Cloud functions below
 * Note: these are background events, basically event listeners
 * They are guaranteed 'at-least-once execution'
 * If these functions fail, they will not attempt to retry (currently)
 * Firebase has native support for enabling retry on failure
 * This feature will be integrated at some point post-MVP. 
 * https://cloud.google.com/functions/docs/bestpractices/retries
 */


algoliaFunctions.devCreateRecord;
algoliaFunctions.devUpdateRecord;
algoliaFunctions.devDeleteRecord;



