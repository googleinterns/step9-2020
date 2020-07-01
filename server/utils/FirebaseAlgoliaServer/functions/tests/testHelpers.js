/**
 * Initialize constants, libraries
 */
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
const index = client.initIndex('dev_ADS');

const DEFAULT_SLEEP = 5000; // Firebase->Algolia takes a couple secs, WCS

/**
 * Firebase helper functions
 */
/**
 * Add a json entity to COLLECTION 
 * Return a promise that, if fulfilled, contains the entity's firestore id
 */
async function addEntity(jsonEntity) {
  const entityPromise = await db.collection(COLLECTION).add(jsonEntity);
  console.log(`Entity added with id ${entityPromise.id}`);
  await sleep(DEFAULT_SLEEP); // Give the addition some time to reach Algolia
  return entityPromise;
}


/**
 * Delete an entity by it's corresponding firestore id
 */
async function deleteEntity(entityId) {
  const deletePromise = await db.collection(COLLECTION).doc(entityId).delete()
  await sleep(DEFAULT_SLEEP); // Give the deletion some time to reach Algolia
  return deletePromise;      
}

/**
 * Update an entities field(s) by it's corresponding firestore id
 * Fields entered as a json object 
 */
async function updateEntity(entityId, jsonEntityUpdates) {
  const updatePromise = await db.collection(COLLECTION)
                                .doc(entityId)
                                .update(jsonEntityUpdates);
  return updatePromise;
}

async function checkEntityMatches(entityId, expectedData) {
  const entity = await db.collection(COLLECTION).doc(entityId).get();
  if (!entity.exists) {
    throw(`No such document found for ${entityId}`);
  } else {
    const entityData = entity.data()
    if (!isEquivalent(expectedData, entityData)){
      throw(`\nExpected ${JSON.stringify(expectedData)}\nGot ${JSON.stringify(entityData)}`); 
    }
    console.log(`Expected ${JSON.stringify(expectedData)}\nGot ${JSON.stringify(entityData)}\nLGTM!`)
    return true;
  }
}

async function checkDeleted(entityId) {
  const entity = await db.collection(COLLECTION).doc(entityId).get();
  if(entity.exists) {
    throw(`Document ${entityId} never got deleted.`)
  } else {
    console.log(`Document ${entityId} succesfully deleted.`)
    return true;
  }
}

/**
 * Wrapper function for updateEntity
 * entityPromise does not need to be a QuerablePromise
 * Will throw a string exception if promise not fulfilled yet 
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
 * entityPromise does not need to be a QuerablePromise
 * Will throw a string exception if promise not fulfilled yet 
 */
function deleteEntityFromPromise(entityPromise) {
  var deletePromise = 
      entityPromise.then(promiseValues => {
            deleteEntity(promiseValues.id);
          }).catch((error) => console.log(error));
  return deletePromise;
}

async function checkDeletedFromPromise(entityPromise) {
  await sleep(DEFAULT_SLEEP);

  const checkDeletedPromise = 
    entityPromise.then((promiseValue) => {
      checkDeleted(promiseValue.id)
      .catch((error) => console.log(error));
    });
}

function checkEntityMatchesFromPromise(entityPromise, expectedData) {
  const checkMatchesPromise = 
      entityPromise.then(promiseValue => {
        checkEntityMatches(promiseValue.id, expectedData)
        .catch((error) => console.log("Equality check failed", error));
      });
  return entityPromise;
}


/**
 * Algolia helper functions
 */

function getObjectFromAlgolia(objectID) {
  //index.getObject(objectID).then(object => console.log(JSON.stringify(object.data))).catch((error) => console.log(error));
  return index.getObject(objectID).catch((error) => console.log(error));
}

function getObjectFromAlgoliaWithPromise(promise) {
  const algoliaPromise = promise.then(promiseValue => getObjectFromAlgolia(promiseValue.id));
  algoliaPromise.then(object => {
    if (typeof object !== 'undefined') {
      console.log(`Found ${JSON.stringify(object.data)}`);
    } //else the error message will handle it. 
  }).catch((error) => console.log(error));
  
  return algoliaPromise; 
}

async function checkObjectDeletedFromAlgoliaWithPromise(promise) {
  await sleep(DEFAULT_SLEEP*2);
  getObjectFromAlgoliaWithPromise(promise).then(object => {
    throw("Algolia object should not exist but it does")
  }).catch(function onError(error) {console.log("Deleted from algolia. Above message normal.")});

}

async function checkAlgoliaObjectEqualsFirestoreEntityFromPromise(entityPromise) {
//  await sleep(DEFAULT_SLEEP) 
  const algoliaPromise = getObjectFromAlgoliaWithPromise(entityPromise);
  algoliaPromise.then(object => {
    const algoliaData = object.data;
    checkEntityMatchesFromPromise(entityPromise, algoliaData);
  }).catch((error) => console.log("Weird error while comparing algolia and firebase ", error));
}
/**
 * Various helper functions
 */

/**
 * Throws an exception 
 */
function throwPromiseNotFulfilled(querablePromise, action) {
  if (querablePromise.isPending()) {
    throw(`Tried accessing a still pending promise while ${action}`);
  } else if (querablePromise.isRejected()) {
    throw(`Tried accessing a rejected promise while ${action}`);
  } else {
    throw(`throwPromiseNotFulfilled accessed impromerly by ${action}`);
  }
}

/**
 * Modifies a JS promise by adding isPending, isRejected, isFulfilled states
 * Basically modifies a promise into a promise that modifies state 
 */
function MakeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function(v) {
            isFulfilled = true;
            isPending = false;
            return v; 
        }, 
        function(e) {
            isRejected = true;
            isPending = false;
            throw e; 
        }
    );

    result.isFulfilled = function() { return isFulfilled; };
    result.isPending = function() { return isPending; };
    result.isRejected = function() { return isRejected; };
    return result;
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different, objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal, objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects are considered equivalent
    return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



/**
 * Make some functions available for import
 */
module.exports.addEntity = addEntity;
module.exports.updateEntityFromPromise = updateEntityFromPromise;
module.exports.deleteEntityFromPromise = deleteEntityFromPromise;
module.exports.checkDeletedFromPromise = checkDeletedFromPromise;

module.exports.sleep = sleep;

module.exports.MakeQuerablePromise = MakeQuerablePromise;
module.exports.checkEntityMatchesFromPromise = checkEntityMatchesFromPromise;

module.exports.getObjectFromAlgoliaWithPromise = getObjectFromAlgoliaWithPromise;

module.exports.checkObjectDeletedFromAlgoliaWithPromise = checkObjectDeletedFromAlgoliaWithPromise;
module.exports.checkAlgoliaObjectEqualsFirestoreEntityFromPromise = checkAlgoliaObjectEqualsFirestoreEntityFromPromise;