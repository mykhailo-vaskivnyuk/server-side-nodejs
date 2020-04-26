const { MongoClient } = require("mongodb");
const db_oper = require("./operations");

const url = "mongodb://localhost:27017/";
const db_name = "conFusion";

MongoClient.connect(url)
.then( (client) => {

	const db = client.db(db_name);
	
	db_oper.insertDocument(db, "dishes", { "name" : "KULISH", "description" : "Test" })
	.then( (result) => {
		console.log("Document is inserted\n", result.ops);

		return db_oper.findDocuments(db, "dishes");
	})
	.then( (docs) => {
		console.log("Documents are found:\n", docs);

		return db_oper.updateDocument(db, "dishes", { "name" : "KULISH" }, { "description" : "Updated Test" });
	})
	.then( (result) => {
		console.log("Document is updated\n", result.result);

		return db_oper.findDocuments(db, "dishes");
	})
	.then( (docs) => {
		console.log("Documents are found:\n", docs);

		return 	db.dropCollection("dishes");
	})
	.then( (result) => {
		console.log("Drop collection dishes\n", result);

		client.close();
	})
	.catch(console.log);
})
.catch(console.log);
