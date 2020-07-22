/**
 * Description: retry wrapper for testing assertions that require
 *              time to pass for an effect to propagate across 
 *              multiple services. 
 * Date: 7/22/2020
 * Author: Rob Marcus  
 */

const { chai, TIMEOUT_MAX } = require('./testConfig');

/**
 * Helper function that returns a promise that will resolve
 * after an alloted amount of time.
 * @param {integer} ms how many ms the promise should wait before resolving.
 */
function promiseTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps an async function/`=> const` with recursive try and catch logic.
 * If `timeout` grows larger than `TIMEOUT_MAX`, the test will fail
 * and the error message will be returned as the reason for test failure.
 * @param {function} assertions some async (lambda/big arrow) function  
 * @param {integer} timeout number of ms to wait before retrying the assertions
 */
const retryAssertions = async function(assertions, timeout) {
  try {
    await assertions();
  } catch (err) {
    if (timeout > TIMEOUT_MAX) {
        chai.assert.fail(err);
    } else {
      await promiseTimeout(timeout);
      return retryAssertions(assertions, 2 * timeout);
    }
  }
}

module.exports = { retryAssertions };
