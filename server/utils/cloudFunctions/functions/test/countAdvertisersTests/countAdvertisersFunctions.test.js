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
        chai,
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

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      return wrapper(snap).then(() => {
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

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      return wrapper(snap_2018).then(() => {
        return wrapper(snap_2019).then(() => {
          return wrapper(snap_2020).then(() => {
            DEV_AGGREGATES_COLLECTION
                .doc("2018")
                .collection("advertisers")
                .doc(advertiser).get().then(function(doc) {
                  assert.equal(doc.data().numberOfAds, 1);
                });
            
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
    
    
    it(SHOULD_INCREMENT +  'for every ad', () => {
      const advertiser = "adv_c"; 
      const snap_one = snapFromJson({advertiser, startDate: "2019-10-15"}, "dev_ads");
      const snap_two = snapFromJson({advertiser, startDate: "2019-10-16"}, "dev_ads");

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      
      return wrapper(snap_one).then(() => {
        return wrapper(snap_two).then(() => {
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

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      
      return wrapper(snap_one).then(() => {
        return wrapper(snap_two).then(() => {
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

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      
      return wrapper(snap_one).then(() => {
        return wrapper(snap_two).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
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

    it(SHOULD_INCREMENT + 'only for an advertisers ads', () => {
      const snap_one = snapFromJson({advertiser: "adv_f", startDate: "2019-10-15"}, "dev_ads");
      const snap_two = snapFromJson({advertiser: "adv_g", startDate: "2020-10-15"}, "dev_ads");

      const wrapper = firestoreWrap(devUpdateAggregateOnCreate);
      
      return wrapper(snap_one).then(() => {
        return wrapper(snap_two).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc("adv_f").get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 1);
              });
          
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
              .collection("advertisers")
              .doc("adv_g").get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 1);
              });
        });
      }); 
    });  
  });
  
  describe("test_updateAggregateOnDelete", () => {
    it("should decrement ad count when deleting an advertisers ad", () => {
      const snap = snapFromJson({advertiser: "adv_a", startDate: "2018-10-15"}, "dev_ads");

      const createWrapper = firestoreWrap(devUpdateAggregateOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAggregateOnDelete);

      return createWrapper(snap).then(() => {
        DEV_AGGREGATES_COLLECTION
              .doc("2018")
              .collection("advertisers")
              .doc("adv_a").get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 1);
              });
        return deleteWrapper(snap).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2018")
              .collection("advertisers")
              .doc("adv_a").get().then(function(doc) {
                assert.equal(doc.data().numberOfAds, 0);
              });
        });
      });
    });

    it("should only decrement if ad count is positive", () => {
      const snap = snapFromJson({advertiser: "adv_a", startDate: "2018-10-15"}, "dev_ads");

      const deleteWrapper = firestoreWrap(devUpdateAggregateOnDelete);
      
      return deleteWrapper(snap).then(() => {
        DEV_AGGREGATES_COLLECTION
            .doc("2018")
            .collection("advertisers")
            .doc("adv_a").get().then(function(doc) {
              assert.equal(doc.data().numberOfAds, 0);
            });
      });
    });

    it("should throw some sort of an error if doc doesn't exist", async () => {
      const snap = snapFromJson({advertiser: "adv_ZZY", startDate: "2018-10-16"}, "dev_ads");

      const deleteWrapper = firestoreWrap(devUpdateAggregateOnDelete);
      chai.expect(() => deleteWrapper(snap)).to.throw(Error);
    });
    
    it("should decrement the right advertisers count when deleting an advertisers ad", () => {
      const snapOne = snapFromJson({advertiser: "adv_X", startDate: "2018-10-16"}, "dev_ads");
      const snapTwo = snapFromJson({advertiser: "adv_Y", startDate: "2018-10-16"}, "dev_ads");

      const createWrapper = firestoreWrap(devUpdateAggregateOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAggregateOnDelete);

      return createWrapper(snapOne).then(() => {
        return createWrapper(snapTwo).then(() => {
          return deleteWrapper(snapOne).then(() => {
            DEV_AGGREGATES_COLLECTION
                  .doc("2018")
                  .collection("advertisers")
                  .doc("adv_X").get().then(function(doc) {
                    assert.equal(doc.data().numberOfAds, 0);
                  });
            DEV_AGGREGATES_COLLECTION
                .doc("2018")
                .collection("advertisers")
                .doc("adv_Y").get().then(function(doc) {
                  assert.equal(doc.data().numberOfAds, 1);
                });
          });
        });
      });
    });

    it("should decrement the right years ad count when deleting an advertisers ad", () => {
      const snapOne = snapFromJson({advertiser: "adv_Z", startDate: "2018-10-16"}, "dev_ads");
      const snapTwo = snapFromJson({advertiser: "adv_Z", startDate: "2019-10-16"}, "dev_ads");

      const createWrapper = firestoreWrap(devUpdateAggregateOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAggregateOnDelete);

      return createWrapper(snapOne).then(() => {
        return createWrapper(snapTwo).then(() => {
          return deleteWrapper(snapOne).then(() => {
            DEV_AGGREGATES_COLLECTION
                  .doc("2018")
                  .collection("advertisers")
                  .doc("adv_Z").get().then(function(doc) {
                    assert.equal(doc.data().numberOfAds, 0);
                  });
            DEV_AGGREGATES_COLLECTION
                .doc("2019")
                .collection("advertisers")
                .doc("adv_Z").get().then(function(doc) {
                  assert.equal(doc.data().numberOfAds, 1);
                });
          });
        });
      });
    });
  });
});
