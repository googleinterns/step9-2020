


const { DEV_ADVERTISERS_2018, DEV_ADVERTISERS_2019, DEV_ADVERTISERS_2020 } = 
    require('./countAdvertisersConfig');

/**
 * Create an advertiser document in whichever collection the advertiser's
 * ad was first served. 
 * @param {string} advertiser name of advertiser, used as docs primary key.
 * @param {Object} collection class linked to a collection of advertisers 
 *     who served ads in the same year as `advertiser`.
 * @return {!Promise}
 */
function createAdvertiserDocument(advertiser, collection) {
  return collection.doc(advertiser).set({numberOfAds: 1});
}

/**
 * If an advertiser document already exists, atomically increment the number of
 * ads by that particular advertiser. 
 * @param {Object} advertiserDoc class linked to an advertisers db document in
 *     a particular year.
 * @param {function(Object): !Promise} advertiserDoc.update firestore update 
 *     api call. 
 * @return {!Promise}    
 */
function incrementAdvertiserCount(advertiserDoc) {
  return advertiserDoc.update({numberOfAds: FieldValue.increment(1)});
}

function decrementAdvertiserCount(advertiserDoc) {
  return advertiserDoc.update({numberOfAds: FieldValue.increment(1)});
}

/**
 * Processes the change object for advertiser name and year the ad campaign
 * began, then checks if that advertiser already has a document in that year.
 * If it does, increment the `numberOfAds` field value atomically. 
 * If it doesn't, create the document with `numberOfAds: 1`. 
 * @param {Object} change a firebase change object.
 * @param {bool} isIncrement if true, increment count, else, decrement.
 * @return !Promise
 */
function updateAdvertiserCount(change, isIncrement) {
  const data = change.after.data();
  const advertiser = data.advertiser;
  const startDate = data.startDate;
  const startYear = startDate.slice(0, 4);
  const collection;

  if(startYear === "2018") {
    collection = DEV_ADVERTISERS_2018;
  } else if (startYear === "2019") {
    collection = DEV_ADVERTISERS_2019;
  } else {
    collection = DEV_ADVERTISERS_2020;
  }

  const advertiserRef = collection.doc(advertiser);
  const advertiserDoc = await advertiserRef.get();

  if (advertiserDoc.exists) {
    if (isIncrement) {
      return incrementAdvertiserDocument(advertiserDoc);
    } else {
      return decrementAdvertiserDocument(advertiserDoc);
    }
  } else {
    // The doc hasn't been made yet, so create the doc with numberOfAds: 1.
    if (isIncrement) {
      return createAdvertiserDocument(collection, advertiser);
    }
  }
}

module.exports = { updateAdvertiserCount }