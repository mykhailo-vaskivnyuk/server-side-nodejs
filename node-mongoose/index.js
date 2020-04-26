const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";

const connection = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connection.then( (db) => {

	console.log("\nDatabase is connected!\n");

	Dishes.create({
		name: "KULISH",
		description: "THE BEST"
	})
	.then( (dish) => {
		
		console.log("The dish %s is saved in database!\n", dish.name, dish);

		return Dishes.findByIdAndUpdate(
			dish._id,
			{ $set: { description: "THE VERY BEST" } },
			{ new: true,
			  useFindAndModify: false}
			);
	})
	.then( (dish) => {

		console.log("The dish %s is updated!\n", dish.name, dish);

		dish.comments.push({
			rating: 5,
			comment: "I have liked this so much!",
			author: "I am"
		});

		return dish.save();
	})
	.then( (dish) => {
		console.log("The dish %s is commented!\n", dish.name, dish);

		return Dishes.deleteMany({});
	})
	.then( (result) => {

		return mongoose.connection.close();
	})
	.then( (result) => {
		console.log("\nConnection to database is closed with result: ", result);
	})
	.catch(console.log);
})
.catch(console.log);
