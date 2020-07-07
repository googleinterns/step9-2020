/**
 * Unit tests for index.js
 * Uses dependency injection to mock algolia save/delete functions
 * Uses sinon/chai to spy on calls and validate behavior
 * compile with `npm run test`
 * Having problems running this on your local? 
 * - Download a firebase service key.
 * - *DON'T* push this key to github please.  
 */

// Initialize the firebase test mocking environment.
const test = require('firebase-functions-test')({
  databaseURL: 'https://step9-2020-capstone.firebaseio.com',
  storageBucket: 'step9-2020-capstone.appspot.com',
  projectId: 'step9-2020-capstone',
}, 'step9-2020-capstone.json');

// Initialize chai, sinon, sinon-chai. 
var assert = require('chai').assert;
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

// Import the generic cloud functions.
const {createRecordFromEntity, updateRecordInIndex, deleteEntityFromIndex} = 
    require('../index.js');

// Import mock saveObject, mock deleteObject, and helpers.
const {saveObject, deleteObject} = require('./algoliaMocks');
const {getFormattedSnap, getFormattedChange} = require('./exampleDataHelpers');

describe("test_createRecordFromEntity", () => {
  it('createRecordFromEntity returns exactly the input data', () => {
    const wrappedAdd = test.wrap(createRecordFromEntity(saveObject));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.deepEqual(addedSnap, getFormattedSnap(snap));
  });

  it('createRecordFromEntity calls saveObject exactly once', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledOnce);
  })

  it('createRecordFromEntity calls saveObject with the correct parameter', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledWith(getFormattedSnap(snap)));
  })
});

describe("test_updateRecordInIndex", () => {
  it('updateRecordInIndex returns exactly the updated data', () => {
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveObject));
    
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.deepEqual(updatedChange, getFormattedChange(randomChange));
  });

  it('updateRecordInIndex calls saveObject exactly once', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('updateRecordInIndex calls saveObject with the correct parameter', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.isTrue(saveSpy.calledWith(getFormattedChange(randomChange)));    
  });
});

describe("test_deleteEntityFromIndex", () => {
  it('deleteEntityFromIndex returns the deleted objects ID', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteEntityFromIndex(deleteSpy));
    const deletedID = wrappedDelete(exampleID);

    deleteSpy.should.have.been.calledWith(deletedID);
  });

  it('deleteEntityFromIndex calls deleteObject exactly once', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteEntityFromIndex(deleteSpy));
    const deletedID = wrappedDelete(exampleID);

    assert.isTrue(deleteSpy.calledOnce);
  });

  it('deleteEntityFromIndex calls deleteObject with the correct parameters', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteEntityFromIndex(deleteSpy));
    const deletedID = wrappedDelete(exampleID);
    
    assert.isTrue(deleteSpy.calledWith(deletedID));    
  })
});