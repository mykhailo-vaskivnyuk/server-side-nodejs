const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotion_example = {
	"name": "Weekend Grand Buffet",
	"image": "images/buffet.png",
	"label": "New",
	"price": "19.99",
	"description": "Featuring . . .",
	"featured": false
};

const promotionSchema = new Schema(
{
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		requireq: true
	},
	label: {
		type: String,
		default: ""
	},
	price: {
		type: Currency,
		required: true,
		min: 0
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	}
}
,{
	timestamps: true
});

const Promotions = mongoose.model("Promotion", promotionSchema);

module.exports = Promotions;
