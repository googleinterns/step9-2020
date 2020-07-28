let wordJson = {}

function addToWords(hit) {
  const wordList = [...hit.data.content.split(" "),
                    ...hit.data.headline.split(" ")];
  wordList.forEach(word => {
    if(wordJson.hasOwnProperty(word)) {
      wordJson[word] += 1;
    } else {
      wordJson[word] = 1;
    }
  });
}

function formatWordsJson(wordsJson) {
  const formattedWordsList = [];

  for (let key in wordsJson) {
    formattedWordsList.push({text: key, value: wordsJson[key]});
  };
  
  return formattedWordsList; 
}

export default { wordJson, addToWords, formatWordsJson }