/**
 * Unit tests for index.js
 * Uses dependency injection to mock algolia save/delete functions
 * Uses sinon/chai to spy on calls and validate behavior
 * compile with `npm run test`
 * Having problems running this on your local? 
 * - Download a firebase service key.
 * - *DON'T* push this key to github please.  
 */
const test = require('firebase-functions-test')({
  databaseURL: 'https://step9-2020-capstone.firebaseio.com',
  storageBucket: 'step9-2020-capstone.appspot.com',
  projectId: 'step9-2020-capstone',
}, 'step9-2020-capstone.json');
const functions = require('firebase-functions');

var assert = require('chai').assert;
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
var expect = chai.expect;
chai.use(sinonChai);

const {addEntityToIndex, updateRecordInIndex, deleteEntityFromIndex} = 
    require('../index.js');

const {saveObject, deleteObject} = require('./algoliaMocks');
const {formattedSnap, formattedChange} = require('./exampleDataHelpers');

describe("test_addEntityToIndex", () => {
  it('addEntityToIndex returns exactly the input data', () => {
    const wrappedAdd = test.wrap(addEntityToIndex(saveObject));

    const snap = test.firestore.exampleDocumentSnapshot();

    const addedSnap = wrappedAdd(snap);
    return chai.assert.deepEqual(addedSnap, formattedSnap(snap));
  });

  it('addEntityToIndex calls saveObject exactly once', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(addEntityToIndex(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledOnce);
  })

  it('addEntityToIndex calls saveObject with the correct parameters', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(addEntityToIndex(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledWith(formattedSnap(snap)));
  })
});

describe("test_updateRecordInIndex", () => {
  it('updateRecordInIndex returns exactly the updated data', () => {
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveObject));
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.deepEqual(updatedChange, formattedChange(randomChange));
  });

  it('updateRecordInIndex calls saveObject exactly once', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('updateRecordInIndex calls saveObject with the correct parameters', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.isTrue(saveSpy.calledWith(formattedChange(randomChange)));    
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