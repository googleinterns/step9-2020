import { app, database } from './firebase';

class Ad {
  constructor (id, impressionsMin ) {
    this.id = id;
    this.impressionsMin = impressionsMin;
  }
  toString() {
    return this.id + ', ' + this.impressionsMin;
  }
}

// Firestore data converter
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

database.collection("testing").withConverter(adConverter).get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) { // doc.data() is never undefined for query doc snapshots
    console.log(doc.data().impressionsMin);
  });
});

const fetchData = async () => {
  const db = database;
  const snapshot = await db.collection("testing").get(); // Get returns a snapshot.
  const ads = snapshot.docs.map(doc => doc.data()); // Get data from each doc.
  return ads;
}

// const fetchData = async () => {
//   const db = database;
//   const snapshot = await db.collection("testing").get(); // Get returns a snapshot.
//   const ads = snapshot.docs.map(doc => doc.data()); // Get data from each doc.
//   return ads;
// }

const ads = fetchData();
console.log(ads);

const states = {
  'Alabama': 0,
  'Alaska': 0,
  'American Samoa': 0,
  'Arizona': 0,
  'Arkansas': 0,
  'California': 0,
  'Colorado': 0,
  'Connecticut': 0,
  'Delaware': 0,
  'District of Columbia': 0,
  'Federated States of Micronesia': 0,
  'Florida': 0,
  'Georgia': 0,
  'Guam': 0,
  'Hawaii': 0,
  'Idaho': 0,
  'Illinois': 0,
  'Indiana': 0,
  'Iowa': 0,
  'Kansas': 0,
  'Kentucky': 0,
  'Louisiana': 0,
  'Maine': 0,
  'Marshall Islands': 0,
  'Maryland': 0,
  'Massachusetts': 0,
  'Michigan': 0,
  'Minnesota': 0,
  'Mississippi': 0,
  'Missouri': 0,
  'Montana': 0,
  'Nebraska': 0,
  'Nevada': 0,
  'New Hampshire': 0,
  'New Jersey': 0,
  'New Mexico': 0,
  'New York': 0,
  'North Carolina': 0,
  'North Dakota': 0,
  'Northern Mariana Islands': 0,
  'Ohio': 0,
  'Oklahoma': 0,
  'Oregon': 0,
  'Palau': 0,
  'Pennsylvania': 0,
  'Puerto Rico': 0,
  'Rhode Island': 0,
  'South Carolina': 0,
  'South Dakota': 0,
  'Tennessee': 0,
  'Texas': 0,
  'Utah': 0,
  'Vermont': 0,
  'Virgin Island': 0,
  'Virginia': 0,
  'Washington': 0,
  'West Virginia': 0,
  'Wisconsin': 0,
  'Wyoming': 0
};

export { ads, states }