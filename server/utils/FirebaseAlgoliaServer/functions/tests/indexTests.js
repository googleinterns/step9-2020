/**
 * BACKGROUND
 * This code indirectly tests the firebase cloud functions:
 * addEntityToIndex, deleteEntityFromIndex, updateRecordInIndex.
 *
 * These functions essentially link two different databases in realtime,
 * And they cannot be directly tested because of how cloud functions work.
 * So testing has to be done in realtime online,
 * Which makes testing somewhat difficult due to asynchronous operations
 * Happening in weird orders.
 * SO this code doesn't use unittests (couldn't get them to work), 
 * and instead does live operations on the DBs, checks the DB state, 
 * throws exceptions if something is amiss, 
 * and if everything is ok will print to the console that things are working.
 *
 * There are a lot of sleeping/timeout calls being made, with many magic #s
 * Experimentally determined times so that calls get processed correctly 
 *
 * TL;DR: 
 * - Can't test normally, so test it this abnormal and _painful_ way
 * - Kind of stupid
 * - If it's stupid but it works...  
 */

/*
 * Tests being performed:
 * singleEntityDeliveredAndDeleted_SUCCESS
 * - Add something to firebase, make sure it's added to algolia.
 *   Delete the comment and make sure it gets deleted from algolia.
 * singleEntityUpdated_SUCCESS
 * - The above, but also update in firebase and make sure update is propogated.
 * twoEntitiesAddedDeletedIndependently_SUCCESS
 * - Add two things, make sure both get in.
 *                   delete one and make sure the other is still there.
 * twoEntitiesUpdateIndependently_SUCCESS
 * - Add two things, update one, make sure the other isn't modified. 
 * RUN TESTS INDIVIDUALLY TO AVOID ASYNC ISSUES!
 */

var helpers = require('./testHelpers');


/**
 * Add an entity in firestore/algolia
 * Then delete it from both DBs.
 */
function singleEntityDeliveredAndDeleted_SUCCESS() {
  console.log("Testing singleEntityDeliveredAndDeleted_SUCCESS")

  // Create in firestore and make sure it gets to algolia
  var addPromise = 
      helpers.addEntity({"Testing" : "if firebase entities reach algolia"});
  var theyEqualPromise = 
      helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromise);
  
  // Delete from firestore + algolia
  // This will also validate that the entities actually got deleted
  helpers.deleteFromEverywhere(addPromise);
}

/**
 * Create an entity, update it, make sure the algolia version is updated
 * NOTE: may have problems depending on how long it takes algolia to get update
 *       easiest way to test this is through the firebase/algolia console. 
 */
function singleEntityUpdated_SUCCESS() {
  console.log("Testing singleEntityUpdated_SUCCESS")

  // Create in firestore and make sure it gets to algolia
  var addPromise = 
      helpers.addEntity({"Testing" : "if firebase entities reach algolia"});
  var theyEqualPromise = 
      helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromise);

  // setTimeout basically preserves the order
  // otherwise delete could happen before update, for example. 
  setTimeout(function(){
    console.log("In the process of updating the entity")
    var updatePromise = 
        helpers
        .updateEntityFromPromise(addPromise, {"Testing" : "if updates reach"});
    var theyStillEqualPromise = 
        helpers
        .checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromise);
  }, 3000);  

  helpers.deleteFromEverywhere(addPromise);
}

/**
 * Creating two entities and deleting one of them shouldn't delete the other.
 */
function twoEntitiesAddedDeletedIndependently_SUCCESS() {
  console.log("Testing twoEntitiesAddedDeletedIndependently_SUCCESS");

  // Create in firestore and make sure it gets to algolia
  var addPromiseOne = 
        helpers.addEntity({"Testing" : "entity one"});
  var addPromiseTwo = 
        helpers.addEntity({"Testing" : "entity two"});
  
  var checkPromiseOneAdded = 
      helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromiseOne);
  var checkPromiseTwoAdded = 
      helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromiseTwo);
  
  // Delete the first entity, make sure the other still exists/unchanged
  helpers.deleteFromEverywhere(addPromiseOne);
  var checkPromiseOneDeleted = 
      helpers.checkObjectDeletedFromAlgoliaWithPromise(addPromiseOne);
  var checkPromiseTwoUnchanged = 
      helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromiseTwo);

  helpers.deleteFromEverywhere(addPromiseTwo);
}


/**
 * Creating two entities and updating one of them shouldn't change 
 * the state of the other entity.
 */
function twoEntitiesUpdateIndependently_SUCCESS() {
  console.log("Testing twoEntitiesUpdateIndependently_SUCCESS");

  var addPromiseOne = 
        helpers.addEntity({"Testing" : "entity one"});
  var addPromiseTwo = 
        helpers.addEntity({"Testing" : "entity two"});
  
  // setTimeout basically preserves the order
  // otherwise delete could happen before update, for example.   
  setTimeout(function(){
    console.log("In the process of updating the entity")
    var updatePromise = 
        helpers
        .updateEntityFromPromise
        (addPromiseOne, {"Testing" : "if updates reach"});
    var twoIndependentFromUpdatePromise = 
        helpers
        .checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromiseTwo);
  }, 3000);  
}



singleEntityDeliveredAndDeleted_SUCCESS();