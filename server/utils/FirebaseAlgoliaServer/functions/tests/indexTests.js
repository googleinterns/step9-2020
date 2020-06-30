var helpers = require('./testHelpers');

var addPromise = helpers.addEntity({"Testing" : "this out"});

var algoliaPromise = helpers.getObjectFromAlgoliaWithPromise(addPromise);
var deletePromise = helpers.deleteEntityFromPromise(addPromise);

var checkDeleted = helpers.checkDeletedFromPromise(addPromise);