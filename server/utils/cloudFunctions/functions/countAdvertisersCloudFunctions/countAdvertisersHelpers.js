const { FieldValue } = require('./countAdvertisersConfig');

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

function decrementAdvertiserAggregate(snapshot, collection) {
  const aggregateReference = getAggregateReference(snapshot, collection);

  aggregateReference.get().then(function(doc) {
    if (doc.exists) {

      // Only decrement if the numberOfAds is positive.
      const change = doc.data().numberOfAds > 0 ? -1 : 0;

      return aggregateReference.update({numberOfAds: FieldValue.increment(change)});
    }
    // If the document doesn't exist return undefined.
    return;
  }).catch(err => console.log(err));

  // If the operation fails, return undefined. 
  return;
}

function incrementAdvertiserAggregate(snapshot, collection) {
  const aggregateReference = getAggregateReference(snapshot, collection);

  aggregateReference.get().then(function(doc) {
    if (doc.exists) {
      return aggregateReference.update({numberOfAds: FieldValue.increment(1)});
    } else {
      return aggregateReference.set({numberOfAds: 1});
    }
  }).catch(err => console.log(err));

  // If the operation fails, return undefined. 
  return;
}

module.exports = { decrementAdvertiserAggregate, 
                   incrementAdvertiserAggregate };
