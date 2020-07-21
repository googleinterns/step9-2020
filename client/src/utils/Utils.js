/**
 * generate a random hex color
 * @returns {string} hex color string
 */
const generateRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Creates a hexidecimal color string from a string input. 
 * Taken from here: `https://stackoverflow.com/a/16348977`.
 * Loosely cleaned up for style and comments.
 * This *should* return a valid hash, but if it doesn't,
 * the browser will just display `#000`.
 * @param {string} str input string 
 * @return {string}
 */
function stringToHexColor(str) {
  let hash = 0;
  let hexColor = '#';

  // Compute a hash from the input string.
  for (let index = 0; index < str.length; index++) {
    hash = str.charCodeAt(index) + ((hash << 5) - hash);
  }
  
  // Compute a hex string from the hash.
  for (let index = 0; index < 3; index++) {
    let value = (hash >> (index * 8)) & 0xFF;
    hexColor += ('00' + value.toString(16)).substr(-2);
  }

  return hexColor;
}

export { generateRandomHexColor, stringToHexColor };
