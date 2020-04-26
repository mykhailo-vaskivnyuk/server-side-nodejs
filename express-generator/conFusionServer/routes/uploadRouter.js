const { Router } = require("express");
const uploadRouter = Router();
const { verifyUser, verifyAdmin } = require("../authenticate");
const Multer = require("multer");
const { cors, corsWithOptions } = require("./cors");

//----------------------------------------------------//

uploadRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

uploadRouter.use("/", (req, res, next) => {

	if ( req.method == "GET" ) {
		cors(req, res, next);
		return;
	}

	corsWithOptions(req, res, next);
});

//----------------------------------------------------//

const storage = Multer.diskStorage({
	filename: (req, file, cb) => {
			cb(null, file.originalname);
	},
	destination: (req, file, cb) => {
		cb(null, "public/images");
	}
});

const imageFileFilter = (req, file, cb) => {
	if ( file.originalname.match(/\.(jpeg|jpg|gif|png)$/) ) {
		cb(null, true);
		return;
	}
	cb(new Error("You can upload only image file!"), false);
};

const upload = Multer({
	storage: storage,
	fileFilter: imageFileFilter
});

//----------------------------------------------------//

uploadRouter.use(verifyUser, verifyAdmin);

uploadRouter.use( (req, res, next) => {
	if ( req.method == "POST" ) return next();
	const err = new Error(`${req.method} operation is not supported on /imageUpload!`);
	err.status = 403;
	next(err);
});

//----------------------------------------------------//

uploadRouter.route("/")
.post(upload.single("imageFile"), (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Conten-Type", "application/json");
	res.json(req.file);
});

module.exports = uploadRouter;
