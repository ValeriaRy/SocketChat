var mongodb = require('mongodb');
var assert = require('assert');

function insertIntoDB(comment, result) {
	if (comment) {
		var db = new mongodb.Db('test', new mongodb.Server('localhost', 27017, {}), {safe:false});
		db.open(function(err, db) {
			var collection = db.collection("chat");
			var commentsTime = new Date().toLocaleTimeString();
			collection.insert({userComment: comment, time: commentsTime});
			assert.equal(null, err);
			db.close();
		});
		result("Comment add");
	}
}

var getFromDB = function(result) {
	var db = new mongodb.Db('test', new mongodb.Server('localhost', 27017, {}), {safe:false});
	db.open(function(err, db) {
		var collection = db.collection("chat");
		collection.find().toArray(function(err, docs){
		    result(docs);
		    db.close();
		});
	});
};

exports.insertIntoDB = insertIntoDB;
exports.getFromDB = getFromDB;