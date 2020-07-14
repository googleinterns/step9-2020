/**
 * Description: Unit tests for countAdvertisers.js
 *              Uses sinon/chai to spy on calls and validate behavior.
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 13, 2020
 */

// Import the testing environment configuration
const { test, assert, sinon, firestoreMock, firestoreWrap } = 
    require('../testConfig');

// Import the cloud functions.
const devCountAdvertisers = 
    require('../../countAdvertisersCloudFunctions/devCountAdvertisersFunctions');

// Restore the stubs after each test. 
afterEach(() => {
  sinon.restore();
});

describe("test_devCreateRecord", () => {

});