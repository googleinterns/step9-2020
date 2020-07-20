/**
 * Description: FirestoreDocumentReader reads a firestore collection and converts them
 *              into custom ad objects.
 * Author: Kira Toal
 * Date: 2020/07/14
 */

import { app, database } from './firebase';

const COLLECTION = 'testing';
const ads = [];

/**
 * Firestore documents are read into ad objects for convenience.
 * .withConverter allows Firestore documents to be read in as individual objects as
 *         opposed to one large object.
 * Custom Ad objects are necessary for .withConverter.
 */
class GeochartAd {
  constructor(id, impressionsMin) {
    /**
     * @param {string} id
     * @param {long} impressionsMin
     */
    this.id = id;
    this.impressionsMin = impressionsMin;
  }
  toString() {
    return `${this.id}, ${this.impressionsMin}`;
  }
}

// Firestore data converter converts snapshots to custom objects.
const adConverter = {
  toFirestore(ad) {
    return {
      id: ad.id,
      impressionsMin: ad.impressionsMin,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new GeochartAd(data.id, data.impressionsMin);
  },
};

database
  .collection(COLLECTION)
  .withConverter(adConverter)
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots.
      ads.push(doc.data()); // Push ad object to ads array.
    });
  })
  .catch(err => console.log(err));

export { ads };