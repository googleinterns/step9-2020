/**
 * Description: Unit tests for index.js
 *              Uses dependency injection to mock algolia save/delete functions
 *              Uses sinon/chai to spy on calls and validate behavior
 *              compile with `npm run test`
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import the testing environment configuration
const {test, assert, sinon} = require('./testConfig');

// Import the generic cloud functions.
const {createRecordFromEntity, updateRecord, deleteRecord} = 
    require('../index.js');

// Import mock saveObject, mock deleteObject, and helpers.
const {saveObject, deleteObject} = require('./algoliaMocks');
const {getFormattedID, getFormattedSnap, getFormattedChange} = 
    require('./exampleDataHelpers');

describe("test_createRecordFromEntity", () => {
  it('calls saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = createRecordWrapper(snap);

    assert.isTrue(saveSpy.calledOnce);
  });

  it('calls saveObject with the correct parameter', () => {
    const saveSpy = sinon.spy(saveObject);
    const createRecordWrapper = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = createRecordWrapper(snap);

    assert.isTrue(saveSpy.calledWith(getFormattedSnap(snap)));
  });
  
  it('should return input data + "altered" field', () => {
    const createRecordWrapper = test.wrap(createRecordFromEntity(saveObject));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = createRecordWrapper(snap);

    assert.deepEqual(addedSnap, getFormattedSnap(snap));
  });
});

describe("test_updateRecord", () => {
  it('calls saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const updateWrapper = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('calls saveObject with the correct parameter', () => {
    var saveSpy = sinon.spy(saveObject);
    const updateWrapper = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);

    assert.isTrue(saveSpy.calledWith(getFormattedChange(randomChange)));    
  });

  it('should return input data + "altered" field', () => {
    const updateWrapper = test.wrap(updateRecord(saveObject));
    
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = updateWrapper(randomChange);

    assert.deepEqual(updatedChange, getFormattedChange(randomChange));
  });
});

describe("test_deleteRecord", () => {
  it('calls deleteObject exactly once', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledOnce);
  });

  it('calls deleteObject with the correct parameters', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const snap = test.firestore.exampleDocumentSnapshot();

    const deleteWrapper = test.wrap(deleteRecord(deleteSpy));
    const deletedID = deleteWrapper(snap);

    assert.isTrue(deleteSpy.calledWith(deletedID.objectID));    
  });
  
  it('should return input data + "altered" field', () => {
    const deleteWrapper = test.wrap(deleteRecord(deleteObject));
    
    const snap = test.firestore.exampleDocumentSnapshot();
    const deletedID = deleteWrapper(snap);

    assert.deepEqual(deletedID, getFormattedID(snap));
  });  
});