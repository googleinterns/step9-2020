/**
 * Description: Integration tests for algolia cloud functions.
 *              Can be flaky. If an error like `ObjectID` does not exist, 
 *              it is probably a problem with algolia flaking. When in doubt,
 *              re-run the tests. Compile with `npm run test`.
 * Notes:
 * - For simplicity, advertisment json's are denoted as `ad`, and 
 *   the advertiser is used as the documents `primary key`. 
 * - Two methods are used to retrieve algolia records, `getObject` and 
 *   `getObjects`. 
 *   - `getObject` takes a string `objectID` returns a json object. 
 *     - If the object doesn't exist, an error will be thrown. 
 *   - `getObjects` takes a string list of `objectID`, and returns a json 
 *     object. 
 *     - If all records exist, the document is of the form 
 *       `{ results: [record1, record2, ...]}`
 *     - If a record doesn't exist, its index in the list will be `null`.
 *       There will also be an additional field `message`:
 *       `{ results, message }`. The message is of the form `'ObjectID {records objectID} does not exist. '`
 *     - Because `getObjects` does not throw an error, it is more useful than 
 *       `getObject` to validate a record has been deleted - if the query 
 *       fails/throws an error for a different reason than the `getObject` 
 *       error, the test would still pass. Checking for a `null` field
 *       and a string equality match is alternatively much easier. 
 *     - For the above reason, `getObjects` is used with singleton lists
 *       to verify that a record has been deleted instead of `getObject`. 
 * - Since error handling is managed by Firestore instead of the cloud 
 *   functions, it seems reasonable to not test for invalid inputs or 
 *   other failures (per Aileme.)
 * - `setTimeout` is used to allow firebase changes to propogate to algolia. 
 *   - `setTimeout` requires that `done()` be called at the end of the 
 *     inner function body. It is not equivalent to `return`. 
 * - `TIMEOUT_10S` was chosen because this is the maximum amount of latency 
 *   for firebase to execute a function. 
 * - `TIMEOUT_15S` is used to extend the default 2000ms limit set by mocha.
 * - The overall test timeout limit must be longer than the `setTimeout`
 *   method to allow time for the algolia api call.    
 * Tests are structured with promise nesting. 
 * - There is a debate about nesting vs chaining promises. In this case, 
 *     nesting is advantageous because it easily keeps everything in scope
 *     without much fuss. Thus, nesting is fine to use. 
 * - Also this is how the official docs do it. 
 * Author: Robert Marcus
 * Date: July 16, 2020
 */


// Import the testing environment configuration.
const { chai,
        TIMEOUT_10S,
        TIMEOUT_15S,
        DEV_ADS_COLLECTION } = require('../testConfig');

const { deleteCollection } = require('../deleteCollection');

// Import firebase environment configuration.
const { DB } = require('../../firebaseConfig');

// Import algolia dev environment configuration.
const { DEV_ADS_INDEX } = 
    require('../../algoliaCloudFunctions/algoliaConfig');

describe("Algolia integrations tests", () => {
  // After every 'describe' block, reset the test environments. 
  // Since these are live dev db's, this process can be very flaky.
  // In general, don't expect an 'advertiser' will be reset from 
  // test to test. 
  after(() => {
    deleteCollection(DB, 'dev_ads');
  });

  describe("test_createRecord", () => {
    it("should propogate an ad document into algolia index", function(done) {
      const ad = {advertiser: "a", startDate: "2019-10-15"};

      DEV_ADS_COLLECTION.doc("a").set(ad).then(() => {
        setTimeout(function(){
          DEV_ADS_INDEX.getObject("a").then(content => {
            chai.expect(content.data).to.deep.equal(ad);
          }).catch(err => console.log(err));

          done();
        }, TIMEOUT_10S);
      });
    }).timeout(TIMEOUT_15S);
    
    it("should propogate multiple ad documents without overwriting", function(done) {
      const adList = [{advertiser: "b", startDate: "2019-10-15"},
                      {advertiser: "c", startDate: "2019-10-15"},
                      {advertiser: "d", startDate: "2019-10-16"}];

      DEV_ADS_COLLECTION.doc("b").set(adList[0]).then(() => {
        DEV_ADS_COLLECTION.doc("c").set(adList[1]).then(() => {
          DEV_ADS_COLLECTION.doc("d").set(adList[2]).then(() => {
            setTimeout(function(){
              DEV_ADS_INDEX.getObjects(["b", "c", "d"]).then(content => {
                chai.expect(content.results[0].data).to.deep.equal(adList[0]);
                chai.expect(content.results[1].data).to.deep.equal(adList[1]);
                chai.expect(content.results[2].data).to.deep.equal(adList[2]);
              }).catch(err => console.log(err));

              done();
            }, TIMEOUT_10S);
          });
        });
      });
    }).timeout(TIMEOUT_15S);
  });

  describe("test_updateRecord", () => {
    it("should propogate a firestore document update to " +
       "an algolia record ", function(done) {
      const ad = {advertiser: "e", startDate: "2019-10-15"};

      DEV_ADS_COLLECTION.doc("e").set(ad).then(() => {
        DEV_ADS_COLLECTION.doc("e").update({startDate: "2020-10-15"}).then(() => {
          setTimeout(function() {
            DEV_ADS_INDEX.getObject("e").then(content => {
              chai.expect(content.data)
                  .to.deep.equal({advertiser: "e", startDate: "2020-10-15"});
            }).catch(err => console.log(err));
            
            done(); 
          }, TIMEOUT_10S);
        });
      });
    }).timeout(TIMEOUT_15S);

    it("should propogate a firestore document update to " + 
       "the proper algolia record", function(done) {
      const adOne = {advertiser: "f", startDate: "2019-10-15"};
      const adTwo = {advertiser: "g", startDate: "2019-10-15"};

      DEV_ADS_COLLECTION.doc("f").set(adOne).then(() => {
        DEV_ADS_COLLECTION.doc("g").set(adTwo).then(() => {
          DEV_ADS_COLLECTION.doc("f").update({startDate: "2020-10-15"}).then(() => {
            setTimeout(function(){
              DEV_ADS_INDEX.getObject("f").then(content => {
                chai.expect(content.data)
                    .to.deep.equal({advertiser: "f", startDate: "2020-10-15"});
              }).catch(err => console.log(err));
              
              DEV_ADS_INDEX.getObject("g").then(content => {
                chai.expect(content.data).to.deep.equal(adTwo);                
              }).catch(err => console.log(err));

              done(); 
            }, TIMEOUT_10S);
          });
        });
      });
    }).timeout(TIMEOUT_15S);
  });

  describe("test_deleteRecord", () => {
    it("should delete an algolia record when a firestore document is deleted", function(done) {
      const ad = {advertiser: "h", startDate: "2019-10-15"};

      DEV_ADS_COLLECTION.doc("h").set(ad).then(() => {
        DEV_ADS_COLLECTION.doc("h").delete().then(() => {
          setTimeout(function(){
            DEV_ADS_INDEX.getObjects(["h"]).then(content => {
              chai.expect(content.message).to.exist;
              chai.expect(content.message.trim()).to.be.equal("ObjectID h does not exist.");
              chai.expect(content.results[0]).to.be.null;
            }).catch(err => console.log(err));

            done();
          }, TIMEOUT_10S);
        });
      });
    }).timeout(TIMEOUT_15S); 

    it("should delete the right algolia record when a firestore document is deleted", function(done) {
      const adOne = {advertiser: "i", startDate: "2019-10-15"};
      const adTwo = {advertiser: "j", startDate: "2019-10-15"};

      DEV_ADS_COLLECTION.doc("i").set(adOne).then(() => {
        DEV_ADS_COLLECTION.doc("j").set(adTwo).then(() => {
          DEV_ADS_COLLECTION.doc("i").delete().then(() => {
            setTimeout(function(){
              DEV_ADS_INDEX.getObjects(["i", "j"]).then(content => {
                chai.expect(content.message).to.exist;
                chai.expect(content.message.trim()).to.be.equal("ObjectID i does not exist.");
                chai.expect(content.results[0]).to.be.null;
              }).catch(err => console.log(err));

              done();
            }, TIMEOUT_10S);
          });
        });
      });
    }).timeout(TIMEOUT_15S); 
  });
});
