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
 * set of invalid strings and that it is not a trivial string
 * i.e., string length <= 1. 
 * @param {string} word
 * @return {boolean}
 */
function isWordValid(word) {
  return (typeof(word) === 'string') &&
         (word.trim().length > 1) &&
         (!INVALID_STRINGS.has(word.toLowerCase().trim()));
}

/**
 * Create a map relating string words (keys)
 * to word cloud formatted json objects (values)
 * If an element of `wordList` is not a string a type error will be thrown.
 * Word cloud format is [{ text: word0, value: number0 }, ...]
 * wordMap format is {word0: { text: word0, value: number0 }, ... } for easily
 * retrieving the word cloud input data without additional parsing. 
 * @param {list[string]} wordList search results split space wise
 * @return {Object}
 */
function createWordMap(wordList) {
  const wordMap = {};

  wordList.forEach(word => {
    if (typeof(word) !== 'string') {
      throw new TypeError(`${word} is not a string`);
    } else if (wordMap.hasOwnProperty(word)) {
      wordMap[word].value += 1;
    } else {
      wordMap[word] = { text: word, value: 1 };
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
  // `/\W+/` is regex for all alphanumeric characters
  // So split(/\W+/) will split the text on any non a-z, A-Z, 0-9
  const searchResultsInnerTextList = 
      Array.from(document.getElementsByClassName(SEARCH_RESULT_CLASS))
           .map(searchResult => searchResult.innerText.split(/\W+/))
           .flat();

  const searchResultsFilteredWordList = 
      searchResultsInnerTextList.filter(word => isWordValid(word));

  const searchResultsWordMap = createWordMap(searchResultsFilteredWordList);

  const wordCloudValues = Object.values(searchResultsWordMap);

  return wordCloudValues;
};

export { generateWordCloudValues };
