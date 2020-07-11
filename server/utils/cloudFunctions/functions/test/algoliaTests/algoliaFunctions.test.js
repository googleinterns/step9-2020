/**
 * Description: Unit tests for algoliaFunctions.js
 *              Uses stubbing to mock algolia save/delete.
 *              Uses sinon/chai to spy on calls and validate behavior.
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 11, 2020
 */

// Import the testing environment configuration
const { test, assert, sinon } = require('../testConfig');

// Import the generic cloud functions.
const algoliaFunctions = require('../../algoliaCloudFunctions/algoliaFunctions');
const { DEV_ADS_INDEX } = require('../../algoliaCloudFunctions/algoliaConfig');

// Import mock saveObject, mock deleteObject, and helpers.
const { mockDeleteObject, mockSaveObject } = require('./algoliaMocks');

// `test` refers to the firestore test functions sdk.
const firestoreMock = test.firestore;   
const firestoreWrap = test.wrap;

// Restore the stubs after each test. 
afterEach(() => {
  sinon.restore();
});

describe("test_devCreateRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveStub = sinon.stub(DEV_ADS_INDEX, "saveObject").callsFake(mockSaveObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const createRecordWrapper = firestoreWrap(algoliaFunctions.devCreateRecord);
    const addedSnap = createRecordWrapper(snap);

    const expectedInput = {data: snap.data(), objectID: snap.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(addedSnap, expectedOutput);
    assert.isTrue(saveStub.calledOnce);
    assert.isTrue(saveStub.calledWithMatch(expectedInput));
  });
});

describe("test_devUpdateRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveStub = sinon.stub(DEV_ADS_INDEX, "saveObject").callsFake(mockSaveObject);
    const randomChange = firestoreMock.exampleDocumentSnapshotChange();

    const updateWrapper = firestoreWrap(algoliaFunctions.devUpdateRecord);
    const updatedChange = updateWrapper(randomChange);

    const expectedInput = {data: randomChange.after.data(), 
                           objectID: randomChange.after.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(updatedChange, expectedOutput);
    assert.isTrue(saveStub.calledOnce);
    assert.isTrue(saveStub.calledWithMatch(expectedInput));
  });
});

describe("test_devDeleteRecord", () => {
  it('should call deleteObject with correct values, return its output', () => {
    const deleteStub = sinon.stub(DEV_ADS_INDEX, "deleteObject").callsFake(mockDeleteObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const deleteWrapper = firestoreWrap(algoliaFunctions.devDeleteRecord);
    const deletedID = deleteWrapper(snap);

    const expectedOutput = {'objectID': snap.id, 'alteredByMockAlgolia': true};
    assert.deepEqual(deletedID, expectedOutput);
    assert.isTrue(deleteStub.calledWithMatch(deletedID.objectID));
    assert.isTrue(deleteStub.calledOnce);
  });  
});
