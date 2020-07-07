const test = require('firebase-functions-test')({
  databaseURL: 'https://step9-2020-capstone.firebaseio.com',
  storageBucket: 'step9-2020-capstone.appspot.com',
  projectId: 'step9-2020-capstone',
}, 'step9-2020-capstone.json');
var assert = require('assert');

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
var expect = chai.expect;
chai.use(sinonChai);
const functions = require('firebase-functions');

const DOC_PATH = 'document/ads';

const {addEntityToIndex, updateRecordInIndex, deleteEntityFromIndex} = 
    require('../index.js');

const {saveObject, deleteObject} = require('./algoliaMocks');
const {formattedSnap, formattedChange} = require('./exampleDataHelpers');

describe("test_addEntityToIndex", () => {
  it('should return itself', () => {
    const wrappedAdd = test.wrap(addEntityToIndex(saveObject));

    const snap = test.firestore.exampleDocumentSnapshot();

    const addedSnap = wrappedAdd(snap);
    return assert.deepEqual(addedSnap, formattedSnap(snap));
  });

  it('saveObject should be called exactly once', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(addEntityToIndex(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    chai.assert.isTrue(saveSpy.calledOnce);
  })
});

describe("test_updateRecordInIndex", () => {
  it('should update with change', () => {
    const wrappedUpdate = test.wrap(updateRecordInIndex(saveObject));
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.deepEqual(updatedChange, formattedChange(randomChange));
  });
});

describe("test_deleteEntityFromIndex", () => {
  it('should delete when deleted', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteEntityFromIndex(deleteSpy));
    const deletedID = wrappedDelete(exampleID);
    deleteSpy.should.have.been.calledWith(deletedID);
  });
});