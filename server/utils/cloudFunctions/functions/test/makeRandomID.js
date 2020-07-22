/**
 * Description: helper function to give test entities
 *              random string IDs. This is preferable to using the system 
 *              clock, as the `Date.now()` implementation does not guarantee
 *              a unique output for consecutive calls.
 * Date: 7/21/2020
 * Author: Robbie Marcus            
 */

/**
 * Generate a random alphanumeric string ID. 
 * @param {integer} length size of output string. 
 */
function makeRandomID(length = 5) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
                      '0123456789';
   const charactersLength = characters.length;
   let randomID = '';

   for (let index = 0; index < length; index++ ) {
      randomID += 
          characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   
   return randomID;
}

module.exports = { makeRandomID }
