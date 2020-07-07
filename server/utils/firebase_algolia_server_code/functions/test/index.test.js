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
const {getFormattedSnap, getFormattedChange} = require('./exampleDataHelpers');

describe("test_createRecordFromEntity", () => {
  it('createRecordFromEntity returns exactly the input data', () => {
    const wrappedAdd = test.wrap(createRecordFromEntity(saveObject));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.deepEqual(addedSnap, getFormattedSnap(snap));
  });

  it('createRecordFromEntity calls saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledOnce);
  })

  it('createRecordFromEntity calls saveObject with the correct parameter', () => {
    const saveSpy = sinon.spy(saveObject);
    const wrappedAdd = test.wrap(createRecordFromEntity(saveSpy));

    const snap = test.firestore.exampleDocumentSnapshot();
    const addedSnap = wrappedAdd(snap);

    assert.isTrue(saveSpy.calledWith(getFormattedSnap(snap)));
  })
});

describe("test_updateRecord", () => {
  it('updateRecord returns exactly the updated data', () => {
    const wrappedUpdate = test.wrap(updateRecord(saveObject));
    
    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.deepEqual(updatedChange, getFormattedChange(randomChange));
  });

  it('updateRecord calls saveObject exactly once', () => {
    const saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);
    
    assert.isTrue(saveSpy.calledOnce);
  });

  it('updateRecord calls saveObject with the correct parameter', () => {
    var saveSpy = sinon.spy(saveObject);
    const wrappedUpdate = test.wrap(updateRecord(saveSpy));

    const randomChange = test.firestore.exampleDocumentSnapshotChange();
    const updatedChange = wrappedUpdate(randomChange);

    assert.isTrue(saveSpy.calledWith(getFormattedChange(randomChange)));    
  });
});

describe("test_deleteRecord", () => {
  it('deleteRecord returns the deleted objects ID', () => {
    const deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteRecord(deleteSpy));
    const deletedID = wrappedDelete(exampleID);

    deleteSpy.should.have.been.calledWith(deletedID);
  });

  it('deleteRecord calls deleteObject exactly once', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteRecord(deleteSpy));
    const deletedID = wrappedDelete(exampleID);

    assert.isTrue(deleteSpy.calledOnce);
  });

  it('deleteRecord calls deleteObject with the correct parameters', () => {
    var deleteSpy = sinon.spy(deleteObject);
    const exampleID = {id: "1"};

    const wrappedDelete = test.wrap(deleteRecord(deleteSpy));
    const deletedID = wrappedDelete(exampleID);
    
    assert.isTrue(deleteSpy.calledWith(deletedID));    
  })
});