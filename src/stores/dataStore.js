var mongodb = require('mongodb');
var globals = require('./globals');

var uri = globals.getDbUri();
var collection = 'games';

exports.query = function (queryId, resolve, reject) {
  mongodb.MongoClient.connect(uri, function(error, db) {
      if (error) {
        console.error("connect error on query", error);
      }
      db.collection(collection).findOne({ "_id": queryId }, function(error, doc) {
        if (error) {
          console.error('error', error);
          reject();
        } else {
          if (doc) {
            console.info('DB resolve');
            resolve(doc.contents);
          } else {
            console.error('DB reject');
            reject();
          }
        }
      });
    });
};

exports.persist = function (queryId, data, resolve, reject) {
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.error("connect error on persist", error);
    } else {
      // See if the record is there
      db.collection(collection).findOne({ "_id": queryId }, function(error, doc) {
        if (error) {
          console.error('error', error);
        } else {
          var operation = 'insertOne';
          if (!doc) { // create new document
            db.collection(collection).insertOne({ "_id": queryId, "contents": data }, function(error, result) {
            if (error) {
              console.error("insert fail", error);
              reject();
            } else {
              console.info("insert success");
              resolve();
            }
            });
          } else { // update existing
            db.collection(collection).update({ "_id": queryId }, { "_id": queryId, "contents": data }, function(error, result) {
              if (error) {
                console.error("update fail", error);
                reject();
              } else {
                console.info("update success");
                resolve();
              }
            });
          }
        } // end else
      }); // end find one
    } // end else
  });
};
