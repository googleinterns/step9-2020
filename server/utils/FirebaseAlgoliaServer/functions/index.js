/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: June 26, 2020
 * Note: Current algolia index is dev_ADS
 */

const algoliasearch = require('algoliasearch');
const functions = require('firebase-functions');

/**
 * Looking to compile this on your local machine but don't have the keys?
 * Save api keys in `environment variables`
 * 1) Go to algolia, log in (ask robbie for credentials.) 
 * 2) Retrieve relevant keys
 * 3) run: firebase functions:config:set 
 *              algolia.app=APP_ID algolia.key=ADMIN_API_KEY
 * Now you can compile! 
 * Please _don't_ expose the API_KEY to the public.
 */
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

// initialize algoliasearch API
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dev_ADS');

// access an individual document in our `ads` collection
const DOC_NAME = 'ads/{adId}';

/**
 * Cloud functions below
 * Vocab: a firestore collection = algolia index
 *        an ad entity = algolia record
 * Note: these are background events, basically event listeners
 * They are guaranteed 'at-least-once execution'
 * If these functions fail, they will not attempt to retry (currently)
 * Firebase has native support for enabling retry on failure
 * This feature will be integrated at some point post-MVP. 
 * https://cloud.google.com/functions/docs/bestpractices/retries
 */


/**
 * When an entity is added to firestore
 * add it (and all it's fields) to the algolia index.
 */
exports.addEntityToIndex = functions.firestore
    .document(DOC_NAME)
    .onCreate(snapshot =>  { // snapshot is a standard naming convention 
      const data = snapshot.data();
      const objectID = snapshot.id; 

      return index.saveObject({data, objectID}); // this is a promise
    });

/**
 * Update record corresponding to ad entity if a change occurs.
 */
exports.updateRecordInIndex = functions.firestore
    .document(DOC_NAME)
    .onUpdate(change => {
      const newData = change.after.data();
      const objectID = change.after.id; 

      return index.saveObject({newData, objectID}); // also a promise
    });

/**
 * If delete an entity from firestore, delete the corresponding record
 */
exports.deleteEntityFromIndex = functions.firestore
    .document(DOC_NAME)
    .onDelete(snapshot => index.deleteObject(snapshot.id)); // also a promise
