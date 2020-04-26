const assert = require("assert");

exports.insertDocument = (db, collection, document) => {
	const coll = db.collection(collection);
	return coll.insertOne(document)
		.then( (result) => {
			console.log("Insert %s document into the collection %s", result.result.n, collection);
			return result;
		});
};


exports.findDocuments = ( (db, collection) => {
	const coll = db.collection(collection);
	return coll.find({}).toArray();
});

exports.updateDocument = ( (db, collection, document, update) => {
	const coll = db.collection(collection);
	return coll.updateOne(document, { $set: update }, null)
		.then( (result) => {
			console.log("Update document with\n", update);
			return result;
		});
});
	

exports.removeDocument = ( (db, collection, document) => {
	const coll = db.collection(collection);
	return coll.deleteOne(document)
		.then( (result) => {
			console.log("Document is removed\n", document);
			return result;
		});
});
