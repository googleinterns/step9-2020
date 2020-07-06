/*
exports.addEntityToIndex = functions.firestore
    .document(DOC_NAME)
    .onCreate(snapshot =>  { // snapshot is a standard naming convention 
      const data = snapshot.data();
      const objectID = snapshot.id; 

      return index.saveObject({data, objectID}); // this is a promise
    });

const functions = require('firebase-functions');


function addEntityToIndex(algoliaIndex, doc_name) {
  functions.firestore
    .document(doc_name)
    .onCreate(snapshot =>  { // snapshot is a standard naming convention 
      const data = snapshot.data();
      const objectID = snapshot.id; 

      return algoliaIndex.saveObject({data, objectID}); // this is a promise
    });
}
*/

function addEntityToIndex(algoliaIndex, snapshot) {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return algoliaIndex.saveObject({data, objectID}); // This is a promise.
}

module.exports.addEntityToIndex = addEntityToIndex