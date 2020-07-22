/**
 * Description: helper function that returns a promise that will resolve
 *              after an alloted amount of time.
 * Date: 7/21/2020
 * Author: Robbie Marcus
 */

/**
 * @param {integer} ms how many ms the promise should wait before resolving.
 */
function promiseTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { promiseTimeout }
