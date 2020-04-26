const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
{
	user: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true,
		uniqe: true
	},
	dishes: [{
		type: Schema.Types.ObjectId,
		ref: "Dish",
		required: true
	}]
},
{
	timestamps: true
});

const Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;
