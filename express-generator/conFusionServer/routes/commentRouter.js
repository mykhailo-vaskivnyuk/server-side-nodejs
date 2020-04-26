const { Router } = require("express");
const commentRouter = Router();
const Comments = require("../models/comments");
const { verifyUser, verifyAdmin } = require("../authenticate");
const { cors, corsWithOptions } = require("./cors");

//----------------------------------------------------//

commentRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

commentRouter.use("/", (req, res, next) => {

	if ( req.method == "GET" ) {
		cors(req, res, next);
		return;
	}

	corsWithOptions(req, res, next);
});

//----------------------------------------------------//

commentRouter.use("/", (req, res, next) => {
	if ( req.method == "GET") return next();
	verifyUser(req, res, next);
});

commentRouter.delete("/", verifyAdmin);

//----------------------------------------------------//

commentRouter.use("/:commentId", (req, res, next) => {

	Comments.findById(req.params.commentId)
	.then( (comment) => {

		if (!comment) {
			const err = new Error('Comment ' + req.params.commentId + ' is not found!');
			err.status = 404;
			return next(err);
		}

		req.comment = comment;
		if ( req.method == "GET" || req.method == "POST" ) return next();
		if ( comment.author.equals(req.user._id) ) return next();
	
		const err = new Error(`You aren't the author of this comment!`);
		err.status = 403;
		next(err);

	}, next)
	.catch(next);
});

//----------------------------------------------------//

commentRouter.use("/", (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	next();
});

//----------------------------------------------------//

commentRouter.route("/")
.get( (req, res, next) => {
	Comments.find(req.query)
	.populate('author')
	.then(res.json, next)
	.catch(next);
})
.post( (req, res, next) => {

	if ( req.body == null ) {
		const err = new Error('Comment is not found in request body!');
		err.status = 404;
		return next(err);
	}

	req.body.author = req.user._id;
	Comments.create(req.body)
	.then( (comment) => {
		req.comment = comment;
		next();
	}, next)
	.catch(next);
})
.put( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
	res.end(`PUT operation is not supported on /comments`);
})
.delete( (req, res, next) => {
	Comments.remove({})
	.then(res.json, next)
	.catch(next);
});

//----------------------------------------------------//

commentRouter.route("/:commentId")
.get( (req, res, next) => {
	next();
})
.post( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
	res.end(`POST operation is not supported on /comments/${req.params.commentId}`);
})
.put( (req, res, next) => {
	Comments.findByIdAndUpdate(
		req.comment._id,
		{ $set: req.body },
		{ new: true }
	)
	.then( () => next(), next)
	.catch(next);
})
.delete( (req, res, next) => {
	Comments.findByIdAndRemove(req.comment._id)
	.then(res.json, next)
	.catch(next);
});

//----------------------------------------------------//

commentRouter.use( (req, res, next) => {
	Comments.findById(req.comment._id)
	.populate('author')
	.then(res.json, next)
	.catch(next);
});

//----------------------------------------------------//

module.exports = commentRouter;
