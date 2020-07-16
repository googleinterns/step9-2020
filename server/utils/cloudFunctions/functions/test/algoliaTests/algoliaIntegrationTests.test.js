/**
 * Description: Integration tests for algolia cloud functions.
 *              Can be flaky. If an error like `ObjectID` does not exist, 
 *              it is probably a problem with algolia flaking. 
 *              compile with `npm run test`.
 * Author: Robert Marcus
 * Date: July 11, 2020
 */


// Import the testing environment configuration
const { test, 
        assert, 
        sinon, 
        chai,
        firestoreMock, 
        firestoreWrap, 
        TIMEOUT_10S,
        TIMEOUT_15S,
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
    it("should propogate an ad document into algolia index", function(done) {
      const data = {advertiser: "a", startDate: "2019-10-15"};

      DB.collection(DEV_ADS_PATH).doc("a").set(data).then(() => {
        setTimeout(function(){
          DEV_ADS_INDEX.getObject("a").then(content => {
            chai.expect(content.data).to.deep.equal(data);
          });
          done();
        }, TIMEOUT_10S);
      });
    }).timeout(TIMEOUT_15S);
    
    it("should propogate multiple ad documents without overwriting", function(done) {
      const dataList = [{advertiser: "b", startDate: "2019-10-15"},
                        {advertiser: "c", startDate: "2019-10-15"},
                        {advertiser: "d", startDate: "2019-10-16"}];

      DB.collection(DEV_ADS_PATH).doc("b").set(dataList[0]).then(() => {
        DB.collection(DEV_ADS_PATH).doc("c").set(dataList[1]).then(() => {
          DB.collection(DEV_ADS_PATH).doc("d").set(dataList[2]).then(() => {
            setTimeout(function(){
              DEV_ADS_INDEX.getObjects(["b", "c", "d"]).then(({ results }) => {
                chai.expect(results[0].data).to.deep.equal(dataList[0]);
                chai.expect(results[1].data).to.deep.equal(dataList[1]);
                chai.expect(results[2].data).to.deep.equal(dataList[2]);
              });
              done();
            }, TIMEOUT_10S);
          });
        });
      });
    }).timeout(TIMEOUT_15S);
  });

  describe("test_updateRecord", () => {
    it("should propogate a firestore document update to " +
       "an algolia record ", function(done) {
      const data = {advertiser: "e", startDate: "2019-10-15"};

      DB.collection(DEV_ADS_PATH).doc("e").set(data).then(() => {
        DB.collection(DEV_ADS_PATH)
          .doc("e")
          .update({startDate: "2020-10-15"}).then(() => {
          setTimeout(function(){
            DEV_ADS_INDEX.getObject("e").then(content => {
              chai.expect(content.data)
                  .to.deep.equal({advertiser: "e", startDate: "2020-10-15"});
            });
            done(); 
          }, TIMEOUT_10S);
        });
      });
    }).timeout(TIMEOUT_15S);

    it("should propogate a firestore document update to " + 
       "the proper algolia record", function(done) {
      const data = {advertiser: "f", startDate: "2019-10-15"};
      const dataTwo = {advertiser: "g", startDate: "2019-10-15"};

      DB.collection(DEV_ADS_PATH).doc("f").set(data).then(() => {
        DB.collection(DEV_ADS_PATH).doc("g").set(dataTwo).then(() => {
          DB.collection(DEV_ADS_PATH)
            .doc("f")
            .update({startDate: "2020-10-15"}).then(() => {
              setTimeout(function(){
                DEV_ADS_INDEX.getObject("f").then(content => {
                  chai.expect(content.data)
                      .to.deep.equal({advertiser: "f", startDate: "2020-10-15"});
                });
                
                DEV_ADS_INDEX.getObject("g").then(content => {
                  chai.expect(content.data).to.deep.equal(dataTwo);
                });

                done(); 
              }, TIMEOUT_10S);
            });
        });
      });
    }).timeout(TIMEOUT_15S);
  });

  describe("test_deleteRecord", () => {
    it("should delete an algolia record when a firestore document is deleted", function(done) {
      const data = {advertiser: "h", startDate: "2019-10-15"};

      DB.collection(DEV_ADS_PATH).doc("h").set(data).then(() => {
        DB.collection(DEV_ADS_PATH).doc("h").delete().then(() => {
          setTimeout(function(){
            DEV_ADS_INDEX.getObjects(["h"]).then(content => {
              chai.expect(content.message).to.exist;
              chai.expect(content.message.trim()).to.be.equal("ObjectID h does not exist.");
              chai.expect(content.results[0]).to.be.null;
            });

            done();
          }, TIMEOUT_10S);
        });
      });
    }).timeout(TIMEOUT_15S); 

    it("should delete the right algolia record when a firestore document is deleted", function(done) {
      const data = {advertiser: "i", startDate: "2019-10-15"};
      const dataTwo = {advertiser: "j", startDate: "2019-10-15"};;

      DB.collection(DEV_ADS_PATH).doc("i").set(data).then(() => {
        DB.collection(DEV_ADS_PATH).doc("j").set(data).then(() => {
          DB.collection(DEV_ADS_PATH).doc("i").delete().then(() => {
            setTimeout(function(){
              DEV_ADS_INDEX.getObjects(["i", "j"]).then(content => {
                chai.expect(content.message).to.exist;
                chai.expect(content.message.trim()).to.be.equal("ObjectID i does not exist.");
                chai.expect(content.results[0]).to.be.null;
              });

              done();
            }, TIMEOUT_10S);
          });
        });
      });
    }).timeout(TIMEOUT_15S); 
  });
});