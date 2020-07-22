/**
 * Description: Integration tests for algolia cloud functions.
 *              These tests require Node 12.9.0 or greater.
 *              Update with `nvm install {version}`. 
 *              Compile with `npm run test`.
 * Notes:
 * - For simplicity, advertisement JSONs are denoted as `ad`, and 
 *   a pseudorandom string id is generated for each document ID. 
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
 *       error, the test may still pass. Checking for a `null` field
 *       and a string equality match is alternatively much easier. 
 *     - For the above reason, `getObjects` is used with singleton lists
 *       to verify that a record has been deleted instead of `getObject`. 
 * Errors are handled directly by firebase, so their is no need to validate
 * how errors are handled/resolved.   
 * Author: Robert Marcus
 * Date: July 16, 2020
 */


// Import the testing environment configuration.
// `TIMEOUT_10S` is the maximum amount of latency for firebase 
// to execute a function. 
// `TIMEOUT_15S` and `TIMEOUT_15S` is used to extend the default TIMEOUT_2Stimeout test 
// limit set by mocha. This gives a 5000timeout latency period for the algolia api 
// call and corresponding tests to resolve and execute.
// `TIMEOUT_15S` is used when `TIMEOUT_10S` is used once throughout a test.
// `TIMEOUT_15S` is used when `TIMEOUT_10S` is used twice throughout a test.
const { chai,
        TIMEOUT_2S,
        TIMEOUT_10S,
        TIMEOUT_15S,
        TIMEOUT_MAX,
        DEV_ADS_COLLECTION } = require('../testConfig');

const { deleteCollection } = require('../deleteCollection');

// Import firebase environment configuration.
const { DB } = require('../../firebaseConfig');

// Import algolia dev environment configuration.
const { DEV_ADS_INDEX } = 
    require('../../algoliaCloudFunctions/algoliaConfig');

const { makeRandomID } = require('../makeRandomID');

const { promiseTimeout } = require('../promiseTimeout');

describe("Algolia integrations tests", () => {
  // After every 'describe' block, reset the test environments. 
  // Since these are live dev DBs, this process can be very flaky.
  // In general, don't expect an 'advertiser' will be reset from 
  // test to test. 
  // Note: this will also delete ad records in the corresponding 
  // algolia index. 
  after(() => {
    deleteCollection(DB, 'dev_ads');
  });
  
  describe("test_createRecord", () => {
    it("should propogate an ad document into algolia index", async () => {
      const ad = {advertiser: makeRandomID(), startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(ad.advertiser).set(ad);

      const repeat = async function(timeout) {
        try {
          const content = await DEV_ADS_INDEX.getObject(ad.advertiser);

          chai.expect(content.data).to.deep.equal(ad);
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);

    it("should propogate multiple ad documents " + 
       "without overwriting", async () => {
      const adList = [{advertiser: makeRandomID(), startDate: "2019-10-15"},
                      {advertiser: makeRandomID(), startDate: "2019-10-15"},
                      {advertiser: makeRandomID(), startDate: "2019-10-16"}];

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adList[0].advertiser).set(adList[0]),
          DEV_ADS_COLLECTION.doc(adList[1].advertiser).set(adList[1]),
          DEV_ADS_COLLECTION.doc(adList[2].advertiser).set(adList[2])]);

      const repeat = async function(timeout) {
        try {
          const contentList = 
              await DEV_ADS_INDEX.getObjects([adList[0].advertiser, 
                                              adList[1].advertiser, 
                                              adList[2].advertiser]);

          chai.expect(contentList.results[0].data).to.deep.equal(adList[0]);
          chai.expect(contentList.results[1].data).to.deep.equal(adList[1]);
          chai.expect(contentList.results[2].data).to.deep.equal(adList[2]);
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });

  describe("test_updateRecord", () => {
    it("should propogate a firestore document update to " +
      "an algolia record ", async () => {
      const ad = {advertiser: makeRandomID(), startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(ad.advertiser).set(ad);
      await DEV_ADS_COLLECTION.doc(ad.advertiser)
                              .update({startDate: "2020-10-15"});

      const repeat = async function(timeout) {
        try {
          const content = await DEV_ADS_INDEX.getObject(ad.advertiser);

          chai.expect(content.data).to
              .deep.equal({advertiser: ad.advertiser, startDate: "2020-10-15"});
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);

    it("should propogate a firestore document update to " + 
      "the proper algolia record", async () => {
      const adOne = {advertiser: makeRandomID(), startDate: "2019-10-15"};
      const adTwo = {advertiser: makeRandomID(), startDate: "2019-10-15"};

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adOne.advertiser).set(adOne),
          DEV_ADS_COLLECTION.doc(adTwo.advertiser).set(adTwo)]);
      await DEV_ADS_COLLECTION.doc(adOne.advertiser)
                              .update({startDate: "2020-10-15"});

      const repeat = async function(timeout) {
        try {
          const adOneContent = await DEV_ADS_INDEX.getObject(adOne.advertiser);
          const adTwoContent = await DEV_ADS_INDEX.getObject(adTwo.advertiser);

          chai.expect(adOneContent.data)
              .to.deep.equal({advertiser: adOne.advertiser, startDate: "2020-10-15"});
          chai.expect(adTwoContent.data).to.deep.equal(adTwo);
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });

  describe("test_deleteRecord", () => {
    
    it("should delete an algolia record when a firestore " + 
      "document is deleted", async () => {
      const ad = {advertiser: makeRandomID(), startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(ad.advertiser).set(ad);
      await DEV_ADS_COLLECTION.doc(ad.advertiser).delete()

      const repeat = async function(timeout) {
        try {
          const content = await DEV_ADS_INDEX.getObjects([ad.advertiser]);

          // Checking `ad` is deleted, so verify an error message
          // exists, has the right message, and that index 0
          // is null. Check existence because if doesn't, `.trim()`
          // will yield an unhelpful error and obfuscate the true error.
          chai.expect(content.message).to.exist;
          chai.expect(content.message.trim())
              .to.be.equal(`ObjectID ${ad.advertiser} does not exist.`);
          chai.expect(content.results[0]).to.be.null;  
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
    
    it("should delete the right algolia record when a firestore document " +
      "is deleted", async () => {
      const adOne = {advertiser: makeRandomID(), startDate: "2019-10-15"};
      const adTwo = {advertiser: makeRandomID(), startDate: "2019-10-15"};

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adOne.advertiser).set(adOne), 
          DEV_ADS_COLLECTION.doc(adTwo.advertiser).set(adTwo)]);
      await DEV_ADS_COLLECTION.doc(adOne.advertiser).delete();

      const repeat = async function(timeout) {
        try {
          const contentList = 
              await DEV_ADS_INDEX.getObjects([adOne.advertiser, adTwo.advertiser]);

          chai.expect(contentList.message).to.exist;
          chai.expect(contentList.message.trim())
              .to.be.equal(`ObjectID ${adOne.advertiser} does not exist.`);
          chai.expect(contentList.results[0]).to.be.null;
          chai.expect(contentList.results[1].data).to.deep.equal(adTwo);
        } catch (err) {
          if (timeout > TIMEOUT_MAX) {
            chai.assert.fail(err);
          }
          await promiseTimeout(timeout);
          return repeat(2 * timeout);
        }
      }

      await repeat(TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });
});
