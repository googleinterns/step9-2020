const { FieldValue } = require('./countAdvertisersConfig');

/**
 * Returns a location reference to a document containing the numberOfAds 
 * released by an advertiser in a given year based off the particular year
 * an advertiser released the advertisment contained by snapshot. 
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {Object} 
 */
function getAggregateReference(snapshot, collection) {
  const data = snapshot.data();

  const advertiser = data.advertiser;
  const startDate = data.startDate;
  const startYear = startDate.slice(0, 4);

  const aggregateReference = 
      collection.doc(startYear)
                .collection("advertisers")
                .doc(advertiser);

  return aggregateReference;
}

/**
 * Decrements an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on delete.
 * If the advertisers count document does not exist in the relevant collection,
 * a 500 error will be thrown.
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {!Promise} 
 */
function decrementAdvertiserAggregate(snapshot, collection) {
  const aggregateReference = getAggregateReference(snapshot, collection);

  return aggregateReference.get().then(function(doc) {
    if (doc.exists) {

      // Only decrement if the numberOfAds is positive.
      const change = doc.data().numberOfAds > 0 ? -1 : 0;

      return aggregateReference.update({numberOfAds: FieldValue.increment(change)});
    } else {
      
      // If the document doesn't exist throw an error.
      const errorMessage = { code: 500, 
                            message: snapshot.data().advertiser + 
                                      snapshot.data().startDate +
                                      "aggregate doc not found"};
      throw errorMessage;
    }
  }).catch(err => console.log(err));
}

/**
 * Increments an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on create.
 * If the advertisers count document does not exist in the relevant collection,
 * the document will be made and populated with default value of 1. 
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {!Promise} 
 */
function incrementAdvertiserAggregate(snapshot, collection) {
  const aggregateReference = getAggregateReference(snapshot, collection);

  return aggregateReference.get().then(function(doc) {
    if (doc.exists) {
      return aggregateReference.update({numberOfAds: FieldValue.increment(1)});
    } else {
      return aggregateReference.set({numberOfAds: 1});
    }
  }).catch(err => console.log(err));
}

module.exports = { decrementAdvertiserAggregate, 
                   incrementAdvertiserAggregate };
