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

// Import the cloud functions.
const { devUpdateAggregateOnCreate, devUpdateAggregateOnDelete } = 
    require('../../countAdvertisersCloudFunctions/devCountAdvertisersFunctions');

// Sample snapshot data.
// Call with snapFromJson(AD_DOC_X, "dev_ads") to get a snapshot. 
const AD_DOC_A = {advertiser: 'advertiser_a', startDate: '2019-10-15'};
const AD_DOC_B = {advertiser: 'adverister_b', startDate: '2019-10-15'};
const AD_DOC_C = {advertiser: 'advertiser_c', startDate: '2020-10-15'};
const AD_DOC_D = {advertiser: 'advertiser_d', startDate: '2018-10-15'};

after(() => {
  sinon.restore(); // Restore the stubs after each test. 

  deleteCollection(DB, 'dev_ads');
  deleteCollection(DB, 'dev_aggregates/2018/advertisers');
  deleteCollection(DB, 'dev_aggregates/2019/advertisers');
  deleteCollection(DB, 'dev_aggregates/2020/advertisers');
});

describe("test_updateAggregateOnCreate", () => {
  it('should call saveObject with correct values, return its output', () => {

  });
});


// Un-stub adminInitStub. 
sinon.restore();
