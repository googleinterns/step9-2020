/**
 * Description: React word cloud takes a list of json objects
 *              as input. This code generates the list by
 *              getting search results from the DOM
 *              and counting instances of individual or hyphenated words
 *              using a dictionary mapping approach for efficiency.
 *              Un-interesting words are filtered from the word cloud.
 * Date: 7/28
 * Author: Rob Marcus
 */

import {
  INVALID_STRINGS,
  SEARCH_RESULT_CLASS,
} from '../../constants/word_cloud_constants';

/**
 * Check if a word is black listed by checking for membership in a
 * set of invalid strings.
 * @param {string} word
 * @return {boolean}
 */
function isWordValid(word) {
  return !INVALID_STRINGS.has(word.toLowerCase());
}

/**
 * Create a map relating string words (keys)
 * to word cloud formatted json objects (values)
 * Word cloud format is [{ text: word0, value: number0 }, ...]
 * For speed, wordMap format is {word0: { text: word0, value: number0 }, ... }
 * @param {list[string]} wordList search results split space wise
 * @return {Object}
 */
function createWordMap(wordList) {
  const wordMap = {};

  wordList.forEach(word => {
    if (word !== '') {
      // Remove all non alphanumeric or $-sign characters (i.e., punctuation)
      // for comprehensive string matching without losing context.
      const filteredWord = word.replace(/\W$/g, '');

      if (wordMap.hasOwnProperty(filteredWord)) {
        wordMap[filteredWord].value += 1;
      } else {
        wordMap[filteredWord] = { text: filteredWord, value: 1 };
      }
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
  const searchResultsInnerTextList = Array.from(
    document.getElementsByClassName(SEARCH_RESULT_CLASS)
  )
    .map(searchResult => searchResult.innerText.split(' '))
    .flat();

  const searchResultsFilteredWordList = searchResultsInnerTextList.filter(
    word => isWordValid(word)
  );

  const searchResultsWordMap = createWordMap(searchResultsFilteredWordList);

  const wordCloudValues = Object.values(searchResultsWordMap);

  return wordCloudValues;
};

export { generateWordCloudValues };
