function makeWordMap(wordList) {
  const wordMap = {};

  wordList.forEach(word => {
    if(wordMap.hasOwnProperty(word)) {
      wordMap[word].value += 1;
    } else {
      wordMap[word] = { text: word, value: 1};
    }
  });

  return wordMap;
}

function getHtmlStuff() {
  const searchResultsText = 
      Array.from(document.getElementsByClassName("ais-Hits-item"))
           .map(searchResult => searchResult.innerText.split(" "));

  const searchResultsWordList = searchResultsText.flat();

  return Object.values(makeWordMap(searchResultsWordList));
}

export default getHtmlStuff;