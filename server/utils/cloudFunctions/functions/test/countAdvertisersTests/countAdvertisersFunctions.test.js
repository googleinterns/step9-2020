/**
 * Description: Unit tests for countAdvertisers.js
 *              Uses sinon/chai to spy on calls and validate behavior.
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 13, 2020
 */

// Import the testing environment configuration
const { test, 
        assert, 
        sinon, 
        firestoreMock, 
        firestoreWrap, 
        snapFromJson/*, 
        firestoreCleanup*/ } = require('../testConfig');
const { deleteCollection } = require('../deleteCollection');

const { ADMIN, DB } = require('../../firebaseConfig');

const { DEV_AGGREGATES_COLLECTION } = require('../../countAdvertisersCloudFunctions/countAdvertisersConfig');

// Import the cloud functions.
const { devUpdateAggregateOnCreate, devUpdateAggregateOnDelete } = 
    require('../../countAdvertisersCloudFunctions/devCountAdvertisersFunctions');

// Save some space for test explanation in the test description
const SHOULD_INCREMENT = "should increment advertisers ad count "; 

// Sample snapshot data.
// Call with snapFromJson(AD_DOC_X, "dev_ads") to get a snapshot. 
const AD_DOC_A = {advertiser: 'advertiser_a', startDate: '2019-10-15'};
const AD_DOC_B = {advertiser: 'adverister_b', startDate: '2019-10-15'};
const AD_DOC_C = {advertiser: 'advertiser_c', startDate: '2020-10-15'};
const AD_DOC_D = {advertiser: 'advertiser_d', startDate: '2018-10-15'};

describe('Aggregate cloud functions', () => {
  after(() => {
    deleteCollection(DB, 'dev_ads');
    deleteCollection(DB, 'dev_aggregates/2018/advertisers');
    deleteCollection(DB, 'dev_aggregates/2019/advertisers');
    deleteCollection(DB, 'dev_aggregates/2020/advertisers');
  });

  describe("test_updateAggregateOnCreate", () => {
    it(SHOULD_INCREMENT + 'in the correct year', () => {
      const advertiser = "adv_a"; 
      const startDate = "2019-10-15";
      const startYear = "2019";
      const snap = snapFromJson({advertiser, startDate}, "dev_ads");

      const wrapped = firestoreWrap(devUpdateAggregateOnCreate);
      return wrapped(snap).then(() => {
        return DEV_AGGREGATES_COLLECTION
            .doc(startYear)
            .collection("advertisers")
            .doc(advertiser).get().then(function(doc) {
              assert.equal(doc.data().numberOfAds, 1);
            });
      });
    });

    it(SHOULD_INCREMENT + 'for 2018, 2019, 2020', () => {
      const advertiser = "adv_b"; 
      const snap_2018 = snapFromJson({advertiser, startDate: "2018-10-15"}, "dev_ads");
      const snap_2019 = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");
      const snap_2020 = snapFromJson({advertiser, startDate: "2020-10-15"}, "dev_ads");

      const wrapped = firestoreWrap(devUpdateAggregateOnCreate);
      wrapped(snap_2018).then(() => {
        DEV_AGGREGATES_COLLECTION
            .doc("2018")
            .collection("advertisers")
            .doc(advertiser).get().then(function(doc) {
              assert.equal(doc.data().numberOfAds, 1);
            });
      });

      wrapped(snap_2019).then(() => {
        DEV_AGGREGATES_COLLECTION
            .doc("2019")
            .collection("advertisers")
            .doc(advertiser).get().then(function(doc) {
              assert.equal(doc.data().numberOfAds, 1);
            });
      });

      wrapped(snap_2020).then(() => {
        DEV_AGGREGATES_COLLECTION
            .doc("2020")
            .collection("advertisers")
            .doc(advertiser).get().then(function(doc) {
              assert.equal(doc.data().numberOfAds, 1);
            });
      });
    });
    
    
    it(SHOULD_INCREMENT +  'for every ad', () => {
      const advertiser = "adv_c"; 
      const snap_one = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");
      const snap_two = snapFromJson({advertiser, startDate: "2019-10-16"}, "dev_ads");

      const wrapped = firestoreWrap(devUpdateAggregateOnCreate);
      
      wrapped(snap_one); // Write one ad to the collection, count = 1
      return wrapped(snap_one).then(() => {
        return wrapped(snap_two).then(() => {
          return DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 2);
              });
        });
      }); 
    });

    it(SHOULD_INCREMENT + 'even if ads have same start date', () => {
      const advertiser = "adv_d"; 
      const snap_one = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");
      const snap_two = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");

      const wrapped = firestoreWrap(devUpdateAggregateOnCreate);
      
      wrapped(snap_one); // Write one ad to the collection, count = 1
      return wrapped(snap_one).then(() => {
        return wrapped(snap_two).then(() => {
          return DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 2);
              });
        });
      }); 
    });

    it(SHOULD_INCREMENT + 'only for ads in same year', () => {
      const advertiser = "adv_e"; 
      const snap_one = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");
      const snap_two = snapFromJson({advertiser, startDate: "2020-10-15"}, "dev_ads");

      const wrapped = firestoreWrap(devUpdateAggregateOnCreate);
      
      wrapped(snap_one); // Write one ad to the collection, count = 1
      return wrapped(snap_one).then(() => {
        return wrapped(snap_two).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 1);
              });
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 1);
              });
        });
      }); 
    });    
  });
});

// Un-stub adminInitStub. 
sinon.restore();
