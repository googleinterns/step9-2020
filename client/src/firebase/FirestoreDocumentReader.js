import { app, database } from './firebase';

/* 
 * Description: FirestoreDocumentReader reads a firestore collection and converts them
 *              into custom ad objects.
 * Author: Kira Toal
 * Date: 2020/07/14
 */
 
const COLLECTION = "testing";
let ads = []; 

class Ad {
  constructor(id, impressionsMin) {
    this.id = id;
    this.impressionsMin = impressionsMin;
  }
  toString() {
    return this.id + ', ' + this.impressionsMin;
  }
}

// Firestore data converter converts snapshots to custom objects.
const adConverter = {
  toFirestore: function(ad) {
    return {
      id: ad.id,
      impressionsMin: ad.impressionsMin,
    }
  },
  fromFirestore: function(snapshot, options){
    const data = snapshot.data(options);
    return new Ad(data.id, data.impressionsMin)
  }
}

database.collection(COLLECTION).withConverter(adConverter).get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) { 
    // doc.data() is never undefined for query doc snapshots.
    ads.push(doc.data()); // Push ad object to ads array.
  });
});

export { ads }