
// Set of non-valid word cloud words/strings. 
const nonValidWords = new Set(['',
                              'a',
                              'and',
                              'at',
                              'for',
                              'i',
                              'in',
                              'is',
                              'it',
                              'its',
                              'of',
                              'on',
                              'the',
                              'this',
                              'to',
                              '|']);

/**
 * Check if a word is black listed 
 * @param {string} word 
 * @return {boolean}
 */
function isWordValid(word) {
  return !nonValidWords.has(word.toLowerCase());
}

/**
 * Make a map relating string words (keys)  
 * to word cloud formatted json objects (values)
 * @param {list[string]} wordList search results split space wise
 * @return {Object}
 */
function makeWordMap(wordList) {
  const wordMap = {};

  wordList.forEach(word => {

    // Remove all non alphanumeric or $-sign characters (i.e., punctuation)
    // for more comprehensive string matching. 
    const filteredWord = word.replace(/\W$/g, ''); 
    
    if(wordMap.hasOwnProperty(filteredWord)) {
      wordMap[filteredWord].value += 1;
    } else {
      wordMap[filteredWord] = { text: filteredWord, value: 1};
    }
  });

  return wordMap;
}

/**
 * React word cloud 
 */
const generateWordCloudValues = () => {
  const searchResultsText = 
      Array.from(document.getElementsByClassName('ais-Hits-item'))
           .map(searchResult => searchResult.innerText.split(' '));
                                            
  const searchResultsWordList = 
      searchResultsText.flat().filter(word => isWordValid(word));

  return Object.values(makeWordMap(searchResultsWordList));
}

export default generateWordCloudValues;
