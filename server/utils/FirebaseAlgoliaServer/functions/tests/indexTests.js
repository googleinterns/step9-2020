var helpers = require('./testHelpers');

//var algoliaPromise = helpers.getObjectFromAlgoliaWithPromise(addPromise);
/*var thingsToDelete = []
async function test1() {
  var addPromise = helpers.addEntity({"Testing" : "this out"});

  var algoliaPromise = helpers.getObjectFromAlgoliaWithPromise(addPromise);

  var theyEqualPromise = helpers.checkAlgoliaObjectEqualsFirestoreEntityFromPromise(addPromise);
  
  //var deletePromise = helpers.deleteEntityFromPromise(addPromise);

  //var checkDeleted = helpers.checkDeletedFromPromise(addPromise);
  //delete_async(addPromise);
  thingsToDelete.push(addPromise);
}

async function delete_async(addPromise) {

  var deletePromise = helpers.deleteEntityFromPromise(addPromise);

  var checkDeleted = helpers.checkDeletedFromPromise(addPromise);
}
test1();
console.log(thingsToDelete.length);
//thingsToDelete.forEach(delete_async);
*/
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