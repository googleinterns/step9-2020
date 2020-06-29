/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: June 26, 2020
 * Note: Current algolia index is dev_ADS
 */

const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

/**
 * Looking to compile this on your local machine but don't have the keys?
 * Save api keys in envirorenment variables
 * 1) Go to algolia, log in (ask robbie for credentials.) 
 * 2) Retrieve relevant keys
 * 3) run: firebase functions:config:set 
 *              algolia.app=APP_ID algolia.key=ADMIN_API_KEY
 * Now you can compile! 
 * Please don't expose the API_KEY to the public.
 */
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dev_ADS');


const DOC_NAME = 'ads/{adId}';

/**
 * Cloud functions below
 * Vocab: a firestore collection = algolia index
 *        an ad entity = algolia record
 */


exports.addEntityToIndex = functions.firestore
    .document(DOC_NAME)
    .onCreate(snapshot =>  {
      const data = snapshot.data();
      const objectId = snapshot.id; 

      return index.saveObject({...data, objectId}); // this is a promise
    });

exports.updateRecordInIndex = functions.firestore
    .document(DOC_NAME)
    .onUpdate(change => {
      const newData = change.after.data();
      const objectId = change.after.id;

      return index.saveObject({...newData, objectId}); // this is a promise
    });

exports.deleteEntityFromIndex = functions.firestore
    .document(DOC_NAME)
    .onDelete(snapshot => index.deleteObject(snapshot.id)); // also a promise
