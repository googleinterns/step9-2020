/**
 * Description: Initialize the testing environment
 *              With firebase test functions, and sinon/chai
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

/**
 * Initialize the firebase test mocking environment.
 * Having problems running this locally? 
 * - Download a firebase service key.
 * - *DON'T* push this key to github please.  
 */
const test = require('firebase-functions-test')({
  databaseURL: 'https://step9-2020-capstone.firebaseio.com',
  storageBucket: 'step9-2020-capstone.appspot.com',
  projectId: 'step9-2020-capstone',
}, 'step9-2020-capstone.json');

// Initialize chai, sinon, sinon-chai. 
const assert = require('chai').assert;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

module.exports = {test, assert, sinon};