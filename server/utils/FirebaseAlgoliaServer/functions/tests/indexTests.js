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
 * - Can't test normally, so test it this abnormal way
 * - Kind of stupid
 * - If it's stupid but it works...  
 */

/*
 * Tests being performed:
 * - Ad something to firebase, make sure it's added to algolia.
 * - The above, but delete something and make sure it gets deleted from algolia.
 * - The above, but also update in firebase and make sure update is propogated.
 * - Add two things, make sure both get in.
 * - Add two things, delete one and make sure the other is still there.
 * - Add two things, update one, make sure the other isn't modified. 
 */

var helpers = require('./testHelpers');

function test1() {
  
}


async function test1() {
  var addPromise = helpers.addEntity({"Testing" : "this out"});
  console.log("Seeing if initially equal");
  var theyEqualPromise = helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromise);
    
  await helpers.sleep(5000);
  console.log("Updating some stuff");

  setTimeout(function(){
    var updatePromise = helpers.updateEntityFromPromise(addPromise, {"Testing" : "me"});
    var theyStillEqualPromise = helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(updatePromise);
  }, 3000);
  
  setTimeout(function(){
    var deletePromise = helpers.deleteEntityFromPromise(addPromise);
    var checkDeleted = helpers.checkDeletedFromPromise(addPromise);
    var checkDeletedFromAlgolia = helpers.checkObjectDeletedFromAlgoliaWithPromise(addPromise)
  }, 10000);
}

test1();