// Initialize constants, libraries
// These are public values 
const config = {
                  apiKey: "AIzaSyCR9KXK2iDuaZ3n6WNzZnBORbtpgWE7dvI",
                  authDomain: "step9-2020-capstone.firebaseapp.com",
                  projectId: "step9-2020-capstone"
                };

const admin = require('firebase-admin');
admin.initializeApp(config);

const db = admin.firestore();
const COLLECTION = 'ads'; 

const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

// initialize algoliasearch API
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dev_ADS'); // current index

const DEFAULT_SLEEP = 5000; // Firebase->Algolia takes a couple secs, WCS

// Firebase helper functions 

/**
 * Add a json entity to COLLECTION 
 * @param {json=} jsonEntity the entity to be added to firestore
 * @return {!Promise}  
 */
async function addEntity(jsonEntity) {
  const entityPromise = await db.collection(COLLECTION).add(jsonEntity);
  console.log(`Entity added with id ${entityPromise.id}`);
  await sleep(DEFAULT_SLEEP); // Give the addition some time to reach Algolia
  return entityPromise;
}


/**
 * Delete an entity by it's corresponding firestore id
 * @param {number=} entityId an entities id, taken directly from a promise
 * @return {!Promise}
 */
async function deleteEntity(entityId) {
  const deletePromise = await db.collection(COLLECTION).doc(entityId).delete()
  await sleep(DEFAULT_SLEEP); // Give the deletion some time to reach Algolia
  return deletePromise;      
}

/**
 * Update an entities field(s) by it's corresponding firestore id
 * @param {number=} entityId firestore id for entity being updated
 * @param {json=} jsonEntityUpdates new values for entity k:v pairings
 * @return {!Promise} 
 */
async function updateEntity(entityId, jsonEntityUpdates) {
  const updatePromise = await db.collection(COLLECTION)
                                .doc(entityId)
                                .update(jsonEntityUpdates);
  return updatePromise;
}

/**
 * Checks that the current DB entry Equals the expected data
 * If the DB entry doesn't exist, throws an error
 * If the DB entry insn't equal, throws a different error
 * If successful, writes to the console
 * @param {number=} entityId firestore id for entity being updated
 * @param {json=} expectedData expected DB entry
 * @return {!Promise} 
 */
async function checkEntityEquals(entityId, expectedData) {
  const entity = await db.collection(COLLECTION).doc(entityId).get();
  if (!entity.exists) {
    throw(`Document ${entityId} firestore retrieval FAILURE`);
  } else {
    const entityData = entity.data()
    if (!isEquivalent(expectedData, entityData)){
      throw(`\nExpected ${JSON.stringify(expectedData)}\nGot ${JSON.stringify(entityData)}`); 
    }
    console.log(`Expected ${JSON.stringify(expectedData)}\nGot ${JSON.stringify(entityData)}\nSUCCESS!`)
    return true;
  }
}

/**
 * Validates that an entity has been deleted from firestore
 * If it still exists, throws an error
 * If it's been deleted, writes to the console
 * @param {number=} entityId firestore id for entity being updated
 */
async function checkDeleted(entityId) {
  const entity = await db.collection(COLLECTION).doc(entityId).get();
  if(entity.exists) {
    throw(`Document ${entityId} delete FAILURE.`)
  } else {
    console.log(`Document ${entityId} delete SUCCESS.`)
  }
}

/**
 * Wrapper function for updateEntity
 * @param {!Promise=} entityPromise promise returned when entity was made
 * @param {json=} jsonEntityUpdates new values for entity k:v pairings
 */
function updateEntityFromPromise(entityPromise, jsonEntityUpdates) {
  var updatePromise = 
    entityPromise.then(promiseValues => {
      updateEntity(promiseValues.id, jsonEntityUpdates);
    });
  return entityPromise;
}

/**
 * Wrapper function for deleteEntity
 * Node JS requires a catch statement 
 * @param {!Promise=} entityPromise promise returned when entity was made
 * @return {!Promise} 
 */
function deleteEntityFromPromise(entityPromise) {
  var deletePromise = 
      entityPromise.then(promiseValues => {
            deleteEntity(promiseValues.id);
          }).catch((error) => console.log(error));
  return deletePromise;
}

/**
 * Wrapper function for checkDeleted
 * If an error is thrown (i.e., entity not deleted), it will be caught
 * @param {!Promise=} entityPromise promise returned when entity was made
 * @return {!Promise} 
 */
async function checkDeletedFromPromise(entityPromise) {
  await sleep(DEFAULT_SLEEP); // Allow the delete some time to propogate 

  const checkDeletedPromise = 
    entityPromise.then((promiseValue) => {
      checkDeleted(promiseValue.id)
      .catch((error) => console.log(error));
    });

  return checkDeletedPromise;
}

/**
 * Wrapper for checkEntityEquals
 * If the entity doesn't match expected data, catches the error
 * @param {!Promise=} entityPromise promise returned when entity was made
 * @param {json=} expectedData expected DB entry
 * @return {!Promise}
 */
function checkEntityEqualsFromPromise(entityPromise, expectedData) {
  const checkEqualsPromise = 
      entityPromise.then(promiseValue => {
        checkEntityEquals(promiseValue.id, expectedData)
        .catch((error) => console.log("Equality check FAILURE", error));
      });
  return entityPromise;
}


// Algolia helper functions 

/**
 * Retrieve an entity from Algolia as a JSON object if it exists
 * @param {number=} objectID primary key, equal to entityId
 * @return {!Promise}
 */
function getObjectFromAlgolia(objectID) {
  return index.getObject(objectID)
              .catch((error) => {
                console.log(`Couldn't retrieve ${objectID} because ${error}`)
              });
}

/**
 * Wrapper for getObjectFromAlgolia
 * if the object is empty/null/doesn't exist etc, catches as an error
 * @param {!Promise=} promise promise returned when entity was made in firebase
 * @return {!Promise}
 */
function getObjectFromAlgoliaWithPromise(promise) {
  const algoliaPromise = promise.then(promiseValue => getObjectFromAlgolia(promiseValue.id));
  algoliaPromise.then(object => {
    if (typeof object !== 'undefined') {
      console.log(`Found ${JSON.stringify(object.data)}`);
    } else {
      throw("Malformed object returned from algolia");
    }
  }).catch((error) => console.log(error));
  
  return algoliaPromise; 
}

/**
 * Checks that the algolia record was deleted 
 * Assuming original entity deleted in firestore
 * @param {!Promise=} promise promise returned when entity was made in firebase
 * @return {!Promise}
 */
async function checkObjectDeletedFromAlgoliaWithPromise(promise) {
  await sleep(DEFAULT_SLEEP*2); // Wait for deletion to propogate
  const algoliaPromise = 
      getObjectFromAlgoliaWithPromise(promise).then(object => {
        throw("Algolia object should not exist but it does")
      }).catch(function onError(error) {
        console.log("Above malformed message normal. Algolia deletion SUCCESS")
      });
  return algoliaPromise;
}
/**
 * Gets the entity object from algolia, calls checkEntityEqualsFromPromise
 * with the entityObject as the expectedData
 * Catches error if they aren't equal
 * @param {!Promise=} entityPromise promise returned when entity was made
 */
async function checkAlgoliaObjectEqualsFirestoreEntityFromPromise(entityPromise) {
//  await sleep(DEFAULT_SLEEP) 
  const algoliaPromise = getObjectFromAlgoliaWithPromise(entityPromise);
  algoliaPromise.then(object => {
    const algoliaData = object.data;
    checkEntityEqualsFromPromise(entityPromise, algoliaData);
  }).catch((error) => console.log("Weird error while comparing algolia and firebase ", error));
}

// Various helper functions

/**
 * Deletes entity from firestore, then checks it _really_ was deleted
 * from firestore and algolia
 * @param {!Promise=} initialPromise promise returned when entity was made
 */
function deleteFromEverywhere(initialPromise) {
  setTimeout(function(){
    console.log("Attemping to delete from everywhere"); 
    const deletePromise = deleteEntityFromPromise(initialPromise);
    const checkDeleted = checkDeletedFromPromise(initialPromise);
    const checkDeletedFromAlgolia = checkObjectDeletedFromAlgoliaWithPromise(initialPromise)
  }, 10000);
}

/**
 * Checks equivalence of JSON objects piecewise
 * @param {json=} jsonObjectA initial json object
 * @param {json=} jsonObjectB json object to compare against
 */
function isEquivalent(jsonObjectA, jsonObjectB) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(jsonObjectA);
    var bProps = Object.getOwnPropertyNames(jsonObjectB);

    // If number of properties is different, objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal, objects are not equivalent
        if (jsonObjectA[propName] !== jsonObjectB[propName]) {
            return false;
        }
    }

    // If we made it this far, objects are considered equivalent
    return true;
}

/**
 * Helpful sleep function to delay functions from processing 
 * while waiting for effects to propogate across DBs
 * @param {number=} ms sleep for this many ms
 * @return {!Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




// Make some functions available for import
module.exports.addEntity = addEntity;
module.exports.updateEntityFromPromise = updateEntityFromPromise;

module.exports.checkObjectDeletedFromAlgoliaWithPromise = checkObjectDeletedFromAlgoliaWithPromise;
module.exports.checkAlgoliaObjectEqualsFirestoreEntityFromPromise = checkAlgoliaObjectEqualsFirestoreEntityFromPromise;

module.exports.deleteFromEverywhere = deleteFromEverywhere;
module.exports.sleep = sleep;
