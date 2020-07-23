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
        TIMEOUT_15S,
        DEV_ADS_COLLECTION } = require('../testConfig');

const { deleteCollection } = require('../deleteCollection');

// Import firebase environment configuration.
const { DB } = require('../../firebaseConfig');

// Import algolia dev environment configuration.
const { DEV_ADS_INDEX } = 
    require('../../algoliaCloudFunctions/algoliaConfig');

const { makeRandomID } = require('../makeRandomID');

const { retryAssertions } = require('../retryAssertions');

describe("Algolia integrations tests", () => {
  // After every 'describe' block, reset the test environments. 
  // Note: this will also delete ad records in the corresponding 
  // algolia index. 
  after(() => {
    deleteCollection(DB, 'dev_ads');
  });
  
  describe("test_createRecord", () => {
    it("should propogate an ad document into algolia index", async () => {
      const adv = makeRandomID();
      const ad = {advertiser: adv, startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(ad.advertiser).set(ad);

      const assertion = async () => {
        const content = await DEV_ADS_INDEX.getObject(ad.advertiser);

        chai.expect(content.data).to.deep.equal(ad);
      }

      await retryAssertions(assertion, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);

    it("should propogate multiple ad documents " + 
       "without overwriting", async () => {
      const adv0 = makeRandomID();
      const adv1 = makeRandomID();
      const adv2 = makeRandomID();
      const adList = [{advertiser: adv0, startDate: "2019-10-15"},
                      {advertiser: adv1, startDate: "2019-10-15"},
                      {advertiser: adv2, startDate: "2019-10-16"}];

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adv0).set(adList[0]),
          DEV_ADS_COLLECTION.doc(adv1).set(adList[1]),
          DEV_ADS_COLLECTION.doc(adv2).set(adList[2])]);

      const assertions = async () => {
        const contentList = 
            await DEV_ADS_INDEX.getObjects([adv0, adv1, adv2]); 

        chai.expect(contentList.results[0].data).to.deep.equal(adList[0]);
        chai.expect(contentList.results[1].data).to.deep.equal(adList[1]);
        chai.expect(contentList.results[2].data).to.deep.equal(adList[2]);
      }

      await retryAssertions(assertions, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });

  describe("test_updateRecord", () => {
    it("should propogate a firestore document update to " +
      "an algolia record ", async () => {
      const adv = makeRandomID();
      const ad = {advertiser: adv, startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(adv).set(ad);
      await DEV_ADS_COLLECTION.doc(adv).update({startDate: "2020-10-15"});

      const assertion = async () => {
        const content = await DEV_ADS_INDEX.getObject(adv);

        chai.expect(content.data).to
            .deep.equal({advertiser: adv, startDate: "2020-10-15"});
      }

      await retryAssertions(assertion, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);

    it("should propogate a firestore document update to " + 
      "the proper algolia record", async () => {
      const adv0 = makeRandomID();
      const adv1 = makeRandomID();
      const ad0 = {advertiser: adv0, startDate: "2019-10-15"};
      const ad1 = {advertiser: adv1, startDate: "2019-10-15"};

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adv0).set(ad0),
          DEV_ADS_COLLECTION.doc(adv1).set(ad1)]);
      await DEV_ADS_COLLECTION.doc(adv0)
                              .update({startDate: "2020-10-15"});

      const assertions = async () => {
        const contentList = 
             await DEV_ADS_INDEX.getObjects([adv0, adv1]);

        chai.expect(contentList.results[0].data)
            .to.deep.equal({advertiser: adv0, startDate: "2020-10-15"});
        chai.expect(contentList.results[1].data).to.deep.equal(ad1);
      }

      await retryAssertions(assertions, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });

  describe("test_deleteRecord", () => {
    it("should delete an algolia record when a firestore " + 
      "document is deleted", async () => {
      const adv = makeRandomID();
      const ad = {advertiser: adv, startDate: "2019-10-15"};

      await DEV_ADS_COLLECTION.doc(adv).set(ad);
      await DEV_ADS_COLLECTION.doc(adv).delete()

      const assertions = async () => {
        const contentList = await DEV_ADS_INDEX.getObjects([adv]);

        // Checking `ad` is deleted, so verify an error message
        // exists, has the right message, and that index 0
        // is null. Check existence because if doesn't, `.trim()`
        // will yield an unhelpful error and obfuscate the true error.
        chai.expect(contentList.message).to.exist;
        chai.expect(contentList.message.trim()).to.be
            .equal(`ObjectID ${adv} does not exist.`);
        chai.expect(contentList.results[0]).to.be.null;  
      }

      await retryAssertions(assertions, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
    
    it("should delete the right algolia record when a firestore document " +
      "is deleted", async () => {
      const adv0 = makeRandomID();
      const adv1 = makeRandomID();
      const ad0 = {advertiser: adv0, startDate: "2019-10-15"};
      const ad1 = {advertiser: adv1, startDate: "2019-10-15"};

      await Promise.allSettled([
          DEV_ADS_COLLECTION.doc(adv0).set(ad0), 
          DEV_ADS_COLLECTION.doc(adv1).set(ad1)]);
      await DEV_ADS_COLLECTION.doc(adv0).delete();

      const assertions = async () => {
        const contentList = 
            await DEV_ADS_INDEX.getObjects([adv0, adv1]);

        chai.expect(contentList.message).to.exist;
        chai.expect(contentList.message.trim()).to.be
            .equal(`ObjectID ${adv0} does not exist.`);
        chai.expect(contentList.results[0]).to.be.null;
        chai.expect(contentList.results[1].data).to.deep.equal(ad1);
      }

      await retryAssertions(assertions, TIMEOUT_2S);
    }).timeout(TIMEOUT_15S);
  });
});
