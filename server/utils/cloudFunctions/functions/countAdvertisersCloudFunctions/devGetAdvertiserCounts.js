const { firebaseFunctions } = require('../firebaseConfig');
const { DEV_AGGREGATES_COLLECTION } = require('./countAdvertisersConfig');

function formatAdvertiserCountSnapshot(snap, year) {
  const numberOfAds = snap.data().numberOfAds;
  const advertiser = snap.id;
  const victoryFormattedAdvertiserCount = {x: year, 
                                           y: numberOfAds, 
                                           label: advertiser};
  
  return victoryFormattedAdvertiserCount;
}

exports.getAdvertiserCounts = firebaseFunctions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(500).json({
      message: 'Not allowed.'
    });
  }

  const advertiserCountList = [];
  const inputYear = req.query.year;
  const isoStartDate = new Date(inputYear);
  const parsedYear = isoStartDate.getFullYear().toString(); 

  if (isNaN(parsedYear)) {
    return res.status(400).json({
      message: `${year} is not a valid ISO date input.`
    });
  }

  const advertiserCounts = 
      await DEV_AGGREGATES_COLLECTION.doc(parsedYear)
                                     .collection("advertisers")
                                     .orderBy("numberOfAds", "desc")
                                     .limit(15)
                                     .get();

  advertiserCounts.forEach(snapshot => {
    console.log("Looking at ", snapshot.id);
    advertiserCountList.push(formatAdvertiserCountSnapshot(snapshot, parsedYear));
  });

  console.log(advertiserCountList);
  res.status(200).json({
    message: 'It worked!',
    data: advertiserCountList
  });
  
});
