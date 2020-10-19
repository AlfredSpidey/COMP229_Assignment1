// Created: Alfredo Vieira Neto
// Student Number: 301106786
// Subject: COMP229 - Web Application Development
// Date: 10/01/2020
// Institution: Centennial College
// Component: Database

// Loads MongoDB
var MongoClient = require('mongodb').MongoClient;
// Instanciates the ObjectID converter for ids
var ObjectID = require('mongodb').ObjectID;

// Saves the connection url to the MongoDB database on the cloud
const uri = "mongodb+srv://asa_neto:pass1@comp229asaneto.ohquv.mongodb.net/AsaNetoComp229?retryWrites=true&w=majority";

// Exports GET DELETE UPDATE functions
module.exports = {
    FindinCol1: function() {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        
        return collection.find({ "name": { "$exists": true } }).sort({'name': 1}).toArray();
      }).then(function(items) {
        return items;
      });
    },
    deleteById: function(id) {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        return collection.deleteOne( {_id:id} );
      }).then(function(err, result) {
        return err;
      });
    },
    updateById: function(id, data) {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        return collection.updateOne( {_id:id} , {"$set" : data});
      }).then(function(resp) {
        console.log(resp);
      });
    },
    addCustomer: function(data) {
      return MongoClient.connect(uri).then(function(db) {
        var collection = db.db("AsaNetoComp229").collection('customers');
        return collection.insertOne( data );
      }).then(function(resp) {
        console.log(resp);
      });
    },
  };
  