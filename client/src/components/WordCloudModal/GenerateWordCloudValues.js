/**
 * Description: react word cloud takes a list of json objects
 *              as input. This code generates the list by 
 *              getting search results from the DOM
 *              and counting instances of individual or hyphenated words
 *              using a dictionary mapping approach for efficiency.   
 *              Un-interesting words are filtered from the word cloud.
 * Date: 7/28
 * Author: Rob Marcus
 */

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
 * Word cloud format is [{ text: word0, value: number0 }, ...]
 * For speed, wordMap format is {word0: { text: word0, value: number0 }, ... }
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
 * Generate the values of a react word cloud based on the current 
 * algolia search results in the DOM.
 * Word cloud format is [{ text: word0, value: number0 }, ...] 
 * @return {Object}
 */
const generateWordCloudValues = () => {
  const searchResultsInnerTextList = 
      Array.from(document.getElementsByClassName('ais-Hits-item'))
           .map(searchResult => searchResult.innerText.split(' '));
                                            
  const searchResultsWordList = 
      searchResultsInnerTextList.flat().filter(word => isWordValid(word));

  const searchResultsWordMap = makeWordMap(searchResultsWordList);

  const wordCloudValues = Object.values(searchResultsWordMap);
  
  return wordCloudValues;
}

export default generateWordCloudValues;
