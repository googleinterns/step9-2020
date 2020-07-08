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
const { getExpectedOutputID, getExpectedOutputSnap, getExpectedOutputChange } =
    require('./expectedMockOutputHelpers');

describe("test_createRecordFromEntity", () => {
  it('should call saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));
    const addedSnap = createRecordWrapper(snap);

    assert.isTrue(saveSpy.calledOnce);
  });

  it('should call saveObject with the correct parameters', () => {
    const snap = test.firestore.exampleDocumentSnapshot();
    const saveSpy = sinon.spy(saveObject);

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));
    const addedSnap = createRecordWrapper(snap);

    assert.isTrue(saveSpy.calledWith(getExpectedOutputSnap(snap)));
  });
  
  it('should return input data + "altered" field', () => {
    const snap = test.firestore.exampleDocumentSnapshot();

    const createRecordWrapper = test.wrap(createRecordFromEntity(saveObject));
    const addedSnap = createRecordWrapper(snap);

    assert.deepEqual(addedSnap, getExpectedOutputSnap(snap));
  });
});

describe("test_updateRecord", () => {
  it('should call saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const updateWrapper = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('should call saveObject with the correct parameters', () => {
    const saveSpy = sinon.spy(saveObject);
    const updateWrapper = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);

    assert.isTrue(saveSpy.calledWith(getExpectedOutputChange(randomChange)));    
  });

  it('should return input data + "altered" field', () => {
    const updateWrapper = test.wrap(updateRecord(saveObject));
    
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);

    assert.deepEqual(updatedChange, getExpectedOutputChange(randomChange));
  });
});

describe("test_deleteRecord", () => {
  it('should call deleteObject exactly once', () => {
    const snap = test.firestore.exampleDocumentSnapshot();
    const deleteSpy = sinon.spy(deleteObject);

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledOnce);
  });

  it('should call deleteObject with the correct parameters', () => {
    const snap = test.firestore.exampleDocumentSnapshot();
    const deleteSpy = sinon.spy(deleteObject);

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledWith(deletedID.objectID));    
  });

  it('should return input data + "altered" field', () => {
    const snap = test.firestore.exampleDocumentSnapshot();
    
    const deleteWrapper = test.wrap(deleteRecord(deleteObject));
    const deletedID = deleteWrapper(snap);

    assert.deepEqual(deletedID, getExpectedOutputID(snap));
  });  
});
