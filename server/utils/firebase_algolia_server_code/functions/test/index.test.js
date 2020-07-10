/**
 * Description: Unit tests for index.js
 *              Uses dependency injection to mock algolia save/delete.
 *              Uses sinon/chai to spy on calls and validate behavior.
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import the testing environment configuration
const { test, assert, sinon } = require('./testConfig');
const { functions } = require('../indexConfig');

// Import the generic cloud functions.
const {  INDEX } = 
    require('../indexConfig.js');

const myFunctions = require('../index.js');

// Import mock saveObject, mock deleteObject, and helpers.
const { saveObject, deleteObject } = require('./algoliaMocks');

// `test` refers to the firestore test functions sdk.
const firestoreMock = test.firestore;   
const firestoreWrap = test.wrap;

const admin = require('firebase-admin');


describe("test_createRecordFromEntity", () => {
  it('should call saveObject with correct values, return its output', () => {
    //const saveSpy = sinon.spy(saveObject);
    const stub = sinon.stub(INDEX, "saveObject").callsFake(saveObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const createRecordWrapper = firestoreWrap(myFunctions.createRecord);
    const addedSnap = createRecordWrapper(snap);

    const expectedInput = {data: snap.data(), objectID: snap.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(addedSnap, expectedOutput);
    assert.isTrue(stub.calledOnce);
    assert.isTrue(stub.calledWithMatch(expectedInput));

    stub.restore();
  });
});

describe("test_updateRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    //const saveSpy = sinon.spy(saveObject);
    const stub = sinon.stub(INDEX, "saveObject").callsFake(saveObject);
    const randomChange = firestoreMock.exampleDocumentSnapshotChange();

    const updateWrapper = firestoreWrap(myFunctions.updateRecord);
    const updatedChange = updateWrapper(randomChange);

    const expectedInput = {data: randomChange.after.data(), 
                           objectID: randomChange.after.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(updatedChange, expectedOutput);
    assert.isTrue(stub.calledOnce);
    assert.isTrue(stub.calledWithMatch(expectedInput));
    stub.restore();
  });
});

describe("test_deleteRecord", () => {
  it('should call deleteObject with correct values, return its output', () => {
    //const deleteSpy = sinon.spy(deleteObject);
    const stub = sinon.stub(INDEX, "deleteObject").callsFake(deleteObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const deleteWrapper = firestoreWrap(myFunctions.deleteRecord);
    const deletedID = deleteWrapper(snap);

    const expectedOutput = {'objectID': snap.id, 'alteredByMockAlgolia': true};
    assert.deepEqual(deletedID, expectedOutput);
    assert.isTrue(stub.calledWithMatch(deletedID.objectID));
    assert.isTrue(stub.calledOnce);
    stub.restore();
  });  
});
