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
        snapFromJson,
        DEV_ADS_PATH } = require('../testConfig');

const { deleteCollection } = require('../deleteCollection');

const { ADMIN, DB } = require('../../firebaseConfig');

const { DEV_AGGREGATES_COLLECTION } = 
    require('../../countAdvertisersCloudFunctions/countAdvertisersConfig');

// Import the cloud functions.
const { devUpdateAdvertiserCountOnCreate, devUpdateAdvertiserCountOnDelete } = 
    require('../../countAdvertisersCloudFunctions/devCountAdvertisersFunctions');

// Save some space for test explanation in the test description
const SHOULD_INCREMENT = "should increment advertisers ad count "; 

describe('Aggregate cloud functions', () => {

  // After every 'describe' block, reset the test environments. 
  // Since these are live dev db's, this process can be very flaky.
  // In general, don't expect an 'advertiser' will be reset from 
  // test to test. 
  after(() => {
    deleteCollection(DB, 'dev_ads');
    deleteCollection(DB, 'dev_aggregates/2018/advertisers');
    deleteCollection(DB, 'dev_aggregates/2019/advertisers');
    deleteCollection(DB, 'dev_aggregates/2020/advertisers');
  });

  describe("test_updateAggregateOnCreate", () => {
    it(SHOULD_INCREMENT + 'in the correct year', () => {
      const snap = snapFromJson({advertiser: "adv_a", startDate: "2019-10-15"}, 
                                DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      
      return wrapper(snap).then(() => {
        DEV_AGGREGATES_COLLECTION
            .doc("2019")
            .collection("advertisers")
            .doc("adv_a").get().then(function(doc) {
              return assert.equal(doc.data().numberOfAds, 1);
            }).catch(err => console.log(err));

        return;
      });
    });

    it(SHOULD_INCREMENT + 'for 2018, 2019, 2020', () => {
      const advertiser = "adv_b"; 
      const snapOne = 
          snapFromJson({advertiser, startDate: "2018-10-15"}, DEV_ADS_PATH);
      const snapTwo = 
          snapFromJson({advertiser, startDate: "2019-10-15"}, DEV_ADS_PATH);
      const snapThree = 
          snapFromJson({advertiser, startDate: "2020-10-15"}, DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);

      return wrapper(snapOne).then(() => {
        return wrapper(snapTwo).then(() => {
          return wrapper(snapThree).then(() => {
            DEV_AGGREGATES_COLLECTION
                .doc("2018")
                .collection("advertisers")
                .doc(advertiser).get().then(function(doc) {
                  return assert.equal(doc.data().numberOfAds, 1);
                }).catch(err => console.log(err));
            
            DEV_AGGREGATES_COLLECTION
                .doc("2019")
                .collection("advertisers")
                .doc(advertiser).get().then(function(doc) {
                  return assert.equal(doc.data().numberOfAds, 1);
            }).catch(err => console.log(err));
            
            DEV_AGGREGATES_COLLECTION
                .doc("2020")
                .collection("advertisers")
                .doc(advertiser).get().then(function(doc) {
                  return assert.equal(doc.data().numberOfAds, 1);
                }).catch(err => console.log(err));

            return;
          });
        });
      });
    });
    
    
    it(SHOULD_INCREMENT +  'for every ad', () => {
      const advertiser = "adv_c"; 
      const snapOne = 
          snapFromJson({advertiser, startDate: "2019-10-15"}, DEV_ADS_PATH);
      const snapTwo = 
          snapFromJson({advertiser, startDate: "2019-10-16"}, DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      
      return wrapper(snapOne).then(() => {
        return wrapper(snapTwo).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 2);
              }).catch(err => console.log(err));
            
          return;
        });
      }); 
    });

    it(SHOULD_INCREMENT + 'even if ads have same start date', () => {
      const advertiser = "adv_d"; 
      const snapOne = 
          snapFromJson({advertiser, startDate: "2019-10-15"}, DEV_ADS_PATH);
      const snapTwo = 
          snapFromJson({advertiser, startDate: "2019-10-15"}, DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      
      return wrapper(snapOne).then(() => {
        return wrapper(snapTwo).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 2);
              }).catch(err => console.log(err));
          
          return;
        });
      }); 
    });

    it(SHOULD_INCREMENT + 'only for ads in same year', () => {
      const advertiser = "adv_e"; 
      const snapOne = 
          snapFromJson({advertiser, startDate: "2019-10-15"}, DEV_ADS_PATH);
      const snapTwo = 
          snapFromJson({advertiser, startDate: "2020-10-15"}, DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      
      return wrapper(snapOne).then(() => {
        return wrapper(snapTwo).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 1);
              }).catch(err => console.log(err));
          
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
              .collection("advertisers")
              .doc(advertiser).get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 1);
              }).catch(err => console.log(err));

          return;
        });
      }); 
    });   

    it(SHOULD_INCREMENT + 'only for an advertisers own ads', () => {
      const snapOne = snapFromJson({advertiser: "adv_f", startDate: "2019-10-15"}, 
                                    DEV_ADS_PATH);
      const snapTwo = snapFromJson({advertiser: "adv_g", startDate: "2020-10-15"}, 
                                    DEV_ADS_PATH);

      const wrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      
      return wrapper(snapOne).then(() => {
        return wrapper(snapTwo).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2019")
              .collection("advertisers")
              .doc("adv_f").get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 1);
              }).catch(err => console.log(err));
          
          DEV_AGGREGATES_COLLECTION
              .doc("2020")
              .collection("advertisers")
              .doc("adv_g").get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 1);
              }).catch(err => console.log(err));
          
          return;
        });
      }); 
    });  
  });
  
  describe("test_updateAggregateOnDelete", () => {
    it("should decrement ad count when deleting an advertisers ad", () => {

      // The 'after' should cleanup the DB of "adv_a" references and values
      // in time, but it can be flaky from personal experimentation. 
      // Easy way to avoid this problem is just to switch to adv_A, adv_B, 
      // and so on. 
      const snap = snapFromJson({advertiser: "adv_A", startDate: "2018-10-15"}, 
                                DEV_ADS_PATH);

      const createWrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAdvertiserCountOnDelete);

      return createWrapper(snap).then(() => {
        DEV_AGGREGATES_COLLECTION
              .doc("2018")
              .collection("advertisers")
              .doc("adv_A").get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 1);
              }).catch(err => console.log(err));
        return deleteWrapper(snap).then(() => {
          DEV_AGGREGATES_COLLECTION
              .doc("2018")
              .collection("advertisers")
              .doc("adv_A").get().then(function(doc) {
                return assert.equal(doc.data().numberOfAds, 0);
              }).catch(err => console.log(err));
          
          return;
        });
      });
    });

    it("should only decrement if ad count is positive", () => {
      const snap = snapFromJson({advertiser: "adv_A", 
                                 startDate: "2018-10-15"}, DEV_ADS_PATH);

      const deleteWrapper = firestoreWrap(devUpdateAdvertiserCountOnDelete);
      
      return deleteWrapper(snap).then(() => {
        return DEV_AGGREGATES_COLLECTION
            .doc("2018")
            .collection("advertisers")
            .doc("adv_A").get().then(function(doc) {
              return assert.equal(doc.data().numberOfAds, 0);
            });
      });
    });

    it("should throw some sort of an error if doc doesn't exist", async () => {
      const snap = snapFromJson({advertiser: "new_adv", 
                                 startDate: "2018-10-15"}, DEV_ADS_PATH);

      const deleteWrapper = firestoreWrap(devUpdateAdvertiserCountOnDelete);

      // Because 'new_adv' has never been added to any collection, 
      // It won't have a document/counter associated with it in `dev_aggregates/2018/advertisers`
      // So an error will be thrown and caught. In practice, this should only
      // happen if a `updateAdvertiserCountOnCreate` fails during writing 
      // without retry, or if the entry is manually deleted. 
      chai.expect(() => deleteWrapper(snap)).to.throw(Error);
    });
    
    it("should decrement the right advertisers count when deleting an advertisers ad", () => {
      const snapOne = snapFromJson({advertiser: "adv_B", 
                                    startDate: "2018-10-16"}, DEV_ADS_PATH);
      const snapTwo = snapFromJson({advertiser: "adv_C", 
                                    startDate: "2018-10-16"}, DEV_ADS_PATH);

      const createWrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAdvertiserCountOnDelete);

      return createWrapper(snapOne).then(() => {
        return createWrapper(snapTwo).then(() => {
          return deleteWrapper(snapOne).then(() => {
            DEV_AGGREGATES_COLLECTION
                  .doc("2018")
                  .collection("advertisers")
                  .doc("adv_B").get().then(function(doc) {
                    return assert.equal(doc.data().numberOfAds, 0);
                  }).catch(err => console.log(err));

            DEV_AGGREGATES_COLLECTION
                .doc("2018")
                .collection("advertisers")
                .doc("adv_C").get().then(function(doc) {
                  return assert.equal(doc.data().numberOfAds, 1);
                }).catch(err => console.log(err));

            return;
          });
        });
      });
    });

    it("should decrement the right years ad count when deleting an advertisers ad", () => {
      const snapOne = snapFromJson({advertiser: "adv_D", 
                                    startDate: "2018-10-15"}, DEV_ADS_PATH);
      const snapTwo = snapFromJson({advertiser: "adv_D", 
                                    startDate: "2019-10-15"}, DEV_ADS_PATH);

      const createWrapper = firestoreWrap(devUpdateAdvertiserCountOnCreate);
      const deleteWrapper = firestoreWrap(devUpdateAdvertiserCountOnDelete);

      return createWrapper(snapOne).then(() => {
        return createWrapper(snapTwo).then(() => {
          return deleteWrapper(snapOne).then(() => {
            DEV_AGGREGATES_COLLECTION
                  .doc("2018")
                  .collection("advertisers")
                  .doc("adv_Z").get().then(function(doc) {
                    return assert.equal(doc.data().numberOfAds, 0);
                  }).catch(err => console.log(err)); 
             
            DEV_AGGREGATES_COLLECTION
                .doc("2019")
                .collection("advertisers")
                .doc("adv_Z").get().then(function(doc) {
                  return assert.equal(doc.data().numberOfAds, 1);
                }).catch(err => console.log(err));

            return;
          });
        });
      });
    });
  });
});
