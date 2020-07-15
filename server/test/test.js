const assert = require('assert');
const firebase = require('@firebase/testing'); 

const PROJECT_ID = "step9-2020-capstone"; 

describe("Our political ads app", () => {
  it("Can read items in read-only collection", async() => {
    // initialize db 
    const db = firebase.initializeTestApp({projectId: PROJECT_ID}).firestore();
    const testDoc = db.collection("testing").doc("testDoc");
    await firebase.assertSucceeds(testDoc.get()); 
  })
})