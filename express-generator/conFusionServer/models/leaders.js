const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leader_example = {
	"name": "Peter Pan",
	"image": "images/alberto.png",
	"designation": "Chief Epicurious Officer",
	"abbr": "CEO",
	"description": "Our CEO, Peter, . . .",
	"featured": false
};

const leaderSchema = new Schema(
{
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		requireq: true
	},
	designation: {
		type: String,
		requireq: true
	},
	abbr: {
		type: String,
		requireq: true
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

const Leaders = mongoose.model("Leader", leaderSchema);

module.exports = Leaders;
