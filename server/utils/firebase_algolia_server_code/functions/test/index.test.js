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

const {algoliaIndex} = require('./algoliaMocks');

algoliaIndex();




describe("test_addEntityToIndex", () => {
  it('should return itself', () => {
    const wrappedAdd = test.wrap(addEntityToIndex(algoliaIndex));

    const snap = test.firestore.makeDocumentSnapshot({foo: 'bar'}, DOC_PATH);

    return assert.deepEqual(wrappedAdd(snap),({data: {foo: 'bar'},objectID:"ads"}));
  });
});

describe("test_updateRecordInIndex", () => {
  it('should update with change', () => {
    /*
    const beforeSnap = test.firestore.makeDocumentSnapshot({foo: 'bar'}, DOC_PATH);
    const wrappedAdd = test.wrap(addEntityToIndex(algoliaIndex));
    
    assert.deepEqual(wrappedAdd(beforeSnap), ({data: {foo: 'bar'},objectID:"ads"}));

    const afterSnap = test.firestore.makeDocumentSnapshot({foo: 'faz'}, DOC_PATH);
    const change = test.makeChange(beforeSnap, afterSnap);

    const wrappedUpdate = test.wrap(updateRecordInIndex(algoliaIndex));
    const updatedSnap = wrappedUpdate(change);

    assert.deepEqual(wrappedUpdate(change), ({data: {foo: 'faz'},objectID:"ads"}));
    */
    const wrappedUpdate = test.wrap(updateRecordInIndex(algoliaIndex));
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.deepEqual(updatedChange, {data: randomChange.after.data(), objectID: randomChange.after.id});
  });
});

describe("test_deleteEntityFromIndex", () => {
  it('should delete when deleted', () => {
    var algoliaSpy = sinon.spy(algoliaIndex, 'deleteObject');
    //var algoliaSpy = sinon.spy(algoliaIndex);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteEntityFromIndex(algoliaSpy));
    const deletedID = wrappedDelete(exampleID);
    expect(algoliaSpy.deleteObject).to.have.been.calledWith(exampleID)
    //algoliaSpy.should.have.been.calledWith(deletedID);
  });
});