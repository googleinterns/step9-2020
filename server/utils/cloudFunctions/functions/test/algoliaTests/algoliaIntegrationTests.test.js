// Import the testing environment configuration
const { test, 
        assert, 
        sinon, 
        chai,
        firestoreMock, 
        firestoreWrap, 
        snapFromJson,
        DEV_ADS_PATH } = require('../testConfig');

const { deleteCollection } = require('../deleteCollection');

const { DB } = require('../../firebaseConfig');

const { devCreateRecord, devUpdateRecord, devDeleteRecord } = 
    require('../../algoliaCloudFunctions/devAlgoliaFunctions');
const { DEV_ADS_INDEX } = 
    require('../../algoliaCloudFunctions/algoliaConfig');

describe("Algolia integrations tests", () => {
  after(() => {
    deleteCollection(DB, 'dev_ads');
  });

  describe("test_createRecord", () => {
    it("should propogate an ad document into algolia index", () => {
      const data = {advertiser: "test", startDate: "2019-10-15"};

      return DB.collection(DEV_ADS_PATH).doc("0").set(data).then(() => {
        setTimeout(function(){
          return DEV_ADS_INDEX.getObject("0", function(err, content) {
            console.log(content.objectID + ": " + content.toString());
            assert.deepEqual(data, content);
          });
        }, 5000);
      });
    })
  });
});