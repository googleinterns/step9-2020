/**
 * Description: Constants for generating word cloud values and rendering 
 *              the word cloud.
 * Date: 7/29
 * Author: Rob Marcus 
 */

// Set of invalid word cloud strings/words. 
// This is a super set of conjunctions, common prepositions, pronouns, 
// and potential string artifacts that may pollute the word cloud. 
// It is not fully comprehensive, but it covers many uninteresting 
// words/strings from the word cloud. 
const INVALID_STRINGS = new Set(['',
                                'a',
                                'and',
                                'at',
                                'but',
                                'for',
                                'her',
                                'him',
                                'his',
                                'i',
                                'in',
                                'is',
                                'it',
                                "it's",
                                'its',
                                'nor',
                                'not',
                                'of',
                                'on',
                                'or',
                                'she',
                                'so',
                                'that',
                                'the',
                                'their',
                                'there',
                                'they',
                                'this',
                                'to',
                                'yet',
                                '|']);

// Search results are identified by the `ais-Hits-item` class
// `ais` is algolia instant search.
const SEARCH_RESULT_CLASS = 'ais-Hits-item';

// Word cloud chart options for rendering the cloud and animations. 
const WORD_CLOUD_OPTIONS = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    deterministic: false,
    enableTooltip: true,
    fontFamily: 'impact',
    fontSizes: [10, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'log',
    spiral: 'archimedean',
    transitionDuration: 1000,
};

export { INVALID_STRINGS, SEARCH_RESULT_CLASS, WORD_CLOUD_OPTIONS }
