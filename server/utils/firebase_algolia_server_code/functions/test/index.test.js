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

// Import the generic cloud functions.
const { createRecordFromEntity, updateRecord, deleteRecord } = 
    require('../index.js');

// Import mock saveObject, mock deleteObject, and helpers.
const { saveObject, deleteObject } = require('./algoliaMocks');

// `test` refers to the firestore test functions sdk.
const firestoreMock = test.firestore;   
const firestoreWrap = test.wrap;

describe("test_createRecordFromEntity", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveSpy = sinon.spy(saveObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const createRecordWrapper = firestoreWrap(createRecordFromEntity(saveSpy));
    const addedSnap = createRecordWrapper(snap);

    const expectedInput = {data: snap.data(), objectID: snap.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(addedSnap, expectedOutput);
    assert.isTrue(saveSpy.calledWithMatch(expectedInput));
    assert.isTrue(saveSpy.calledOnce);
  });
});

describe("test_updateRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveSpy = sinon.spy(saveObject);
    const randomChange = firestoreMock.exampleDocumentSnapshotChange();

    const updateWrapper = firestoreWrap(updateRecord(saveSpy));
    const updatedChange = updateWrapper(randomChange);

    const expectedInput = {data: randomChange.after.data(), 
                           objectID: randomChange.after.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(updatedChange, expectedOutput);
    assert.isTrue(saveSpy.calledWithMatch(expectedInput));
    assert.isTrue(saveSpy.calledOnce);
  });
});

describe("test_deleteRecord", () => {
  it('should call deleteObject with correct values, return its output', () => {
    const deleteSpy = sinon.spy(deleteObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const deleteWrapper = firestoreWrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    const expectedOutput = {'objectID': snap.id, 'alteredByMockAlgolia': true};
    assert.deepEqual(deletedID, expectedOutput);
    assert.isTrue(deleteSpy.calledWithMatch(deletedID.objectID));
    assert.isTrue(deleteSpy.calledOnce);
  });  
});
