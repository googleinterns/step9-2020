/**
 * Description: Unit tests for algoliaFunctions.js
 *              Uses stubbing to mock algolia save/delete.
 *              Uses sinon/chai to spy on calls and validate behavior.
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 11, 2020
 */

// Import the testing environment configuration
const { assert, sinon, firestoreWrap, firestoreMock } = 
    require('../testConfig');

// Import the generic cloud functions.
const devAlgoliaFunctions = 
    require('../../algoliaCloudFunctions/devAlgoliaFunctions');
const { DEV_ADS_INDEX } = 
    require('../../algoliaCloudFunctions/algoliaConfig');

// Import mock saveObject, mock deleteObject, and helpers.
const { mockDeleteObject, mockSaveObject } = require('./algoliaMocks');

// Restore the stubs after each test. 
afterEach(() => {
  sinon.restore();
});

describe("test_createRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveStub = 
        sinon.stub(DEV_ADS_INDEX, "saveObject").callsFake(mockSaveObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const createRecordWrapper = 
        firestoreWrap(devAlgoliaFunctions.devCreateRecord);
    const addedSnap = createRecordWrapper(snap);

    const expectedInput = {data: snap.data(), objectID: snap.id};
    const expectedOutput = expectedInput;
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(addedSnap, expectedOutput);
    assert.isTrue(saveStub.calledOnce);
    assert.isTrue(saveStub.calledWithMatch(expectedInput));
  });
});

describe("test_updateRecord", () => {
  it('should call saveObject with correct values, return its output', () => {
    const saveStub = 
        sinon.stub(DEV_ADS_INDEX, "saveObject").callsFake(mockSaveObject);
    const randomChange = firestoreMock.exampleDocumentSnapshotChange();

    const updateWrapper = 
        firestoreWrap(devAlgoliaFunctions.devUpdateRecord);
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

describe("test_deleteRecord", () => {
  it('should call deleteObject with correct values, return its output', () => {
    const deleteStub = 
        sinon.stub(DEV_ADS_INDEX, "deleteObject").callsFake(mockDeleteObject);
    const snap = firestoreMock.exampleDocumentSnapshot();

    const deleteWrapper = 
        firestoreWrap(devAlgoliaFunctions.devDeleteRecord);
    const deletedID = deleteWrapper(snap);

    const expectedOutput = {'objectID': snap.id, 'alteredByMockAlgolia': true};
    assert.deepEqual(deletedID, expectedOutput);
    assert.isTrue(deleteStub.calledWithMatch(deletedID.objectID));
    assert.isTrue(deleteStub.calledOnce);
  });  
});
