var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

const uri = "mongodb+srv://asa_neto:pass1@comp229asaneto.ohquv.mongodb.net/AsaNetoComp229?retryWrites=true&w=majority";
module.exports = {
    FindinCol1: function() {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        
        return collection.find().toArray();
      }).then(function(items) {
        return items;
      });
    },
    deleteById: function(id) {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        const _id = new ObjectID(id);
        return collection.deleteOne( {_id:_id} );
      }).then(function(err, result) {
        return err;
      });
    },
    updateById: function(id, data) {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        
        return collection.updateOne( id , {"$set" : data});
      }).then(function(resp) {
        console.log(resp);
      });
    },
  };
  