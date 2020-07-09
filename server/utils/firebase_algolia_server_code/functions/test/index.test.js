/**
 * Description: Unit tests for index.js
 *              Uses dependency injection to mock algolia save/delete functions
 *              Uses sinon/chai to spy on calls and validate behavior
 *              compile with `npm run test`
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


describe("test_createRecordFromEntity", () => {
  it('should call saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));
    createRecordWrapper(snap);

    assert.isTrue(saveSpy.calledOnce);
  });

  it('should call saveObject with the correct parameters', () => {
    const saveSpy = sinon.spy(saveObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));
    createRecordWrapper(snap);

    const expectedInput = {data: (snap.data()), objectID: (snap.id)};
    assert.isTrue(saveSpy.calledWithMatch(expectedInput));
  });
  
  it('should return saveObject output', () => {
    const snap = test.firestore.exampleDocumentSnapshot();

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveObject));
    const addedSnap = createRecordWrapper(snap);

    const expectedOutput = {data: snap.data(), objectID: snap.id};
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(addedSnap, expectedOutput);
  });
});

describe("test_updateRecord", () => {
  it('should call saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const randomChange = test.firestore.exampleDocumentSnapshotChange();

    const updateWrapper = test.wrap(updateRecord(saveSpy));
    updateWrapper(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('should call saveObject with the correct parameters', () => {
    const saveSpy = sinon.spy(saveObject);
    const randomChange = test.firestore.exampleDocumentSnapshotChange();

    const updateWrapper = test.wrap(updateRecord(saveSpy));
    updateWrapper(randomChange);

    const expectedInput = {data: (randomChange.after.data()), 
                           objectID: (randomChange.after.id)};
    assert.isTrue(saveSpy.calledWithMatch(expectedInput));    
  });

  it('should return saveObject output', () => {
    const randomChange = test.firestore.exampleDocumentSnapshotChange();

    const updateWrapper = test.wrap(updateRecord(saveObject));    
    const updatedChange = updateWrapper(randomChange);

    const expectedOutput = {data: randomChange.after.data(), 
                            objectID: randomChange.after.id};
    expectedOutput.data.alteredByMockAlgolia = true;
    assert.deepEqual(updatedChange, expectedOutput);
  });
});

describe("test_deleteRecord", () => {
  it('should call deleteObject exactly once', () => {
    const deleteSpy = sinon.spy(deleteObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledOnce);
  });

  it('should call deleteObject with the correct parameters', () => {
    const deleteSpy = sinon.spy(deleteObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledWithMatch(deletedID.objectID));    
  });

  it('should return deleteObject output', () => {
    const snap = test.firestore.exampleDocumentSnapshot();
    
    const deleteWrapper = test.wrap(deleteRecord(deleteObject));
    const deletedID = deleteWrapper(snap);

    const expectedOutput = {'objectID': snap.id, 'alteredByMockAlgolia': true};
    assert.deepEqual(deletedID, expectedOutput);
  });  
});