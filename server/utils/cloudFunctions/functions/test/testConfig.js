/**
 * Description: Initialize the testing environment
 *              With firebase test functions, and sinon/chai
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

/**
 * Initialize the firebase test mocking environment. This will:
 * - Take care of the appropriate setup and teardown for your tests
 *   such as setting and unsetting environment variables needed 
 *   by firebase-functions.
 * - Generates sample data and event context, so that you only have 
 *   to specify the fields that are relevant to your test.
 * - Provide mock wrappers for event driven firebase functions.  
 * - Read more here: `https://firebase.google.com/docs/functions/unit-testing`.
 *
 * Having problems running this locally? 
 * - Download a firebase service key and upload to the `functions` directory
 *   with filename `step9-2020-capstone.json`. 
 * - That is all you need to do.   
 * - *DON'T* push this key to github please.  
 */
const test = require('firebase-functions-test')({
  databaseURL: 'https://step9-2020-capstone.firebaseio.com',
  storageBucket: 'step9-2020-capstone.appspot.com',
  projectId: 'step9-2020-capstone',
}, 'step9-2020-capstone.json');

/**
 * Initialize mocha, chai, and sinon. 
 * Mocha is:  
 * - feature rich node js test framework.
 * - encapsulates test suites (describe-block), and test-cases (it-block).
 * - provides test coverage.
 * Chai is: 
 * - An alternative to built in default equality/compare tests, which will
 *   annoyingly pass tests even if their are errors being thrown : (
 * - Chai does not have this problem.
 * - Three assertion interfaces: expect, assert, should. 
 * Sinon is: 
 * - A utility to spy on external methods being used by systems under test.
 * - Primarily used for stubbing external api calls
 *   (Test stubs are functions (spies) with pre-programmed behavior.)
 * - Very handy, can do more but this is the primary purpose in these tests. 
 */
const assert = require('chai').assert;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

module.exports = { test, assert, sinon };
