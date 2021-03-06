// const express = require("express");
const cors = require("cors");
// const app = express();

const whiteList = [
	"http://localhost:3000",
	"https://localhost:3443",
	"https://localhost:4200",
	'http://my_comp_name>:3001'
];

const corsOptionsDelegate = (req, cb) => {
	let corsOptions;

	console.log(req.header("Origin"));

	if ( whiteList.indexOf(req.header("Origin")) > (-1) ) {
		corsOptions = { origin: true};
	} else {
		corsOptions = { origin: false};
	}

	cb(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
