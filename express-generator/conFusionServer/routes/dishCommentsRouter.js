const { Router } = require("express");
const dishCommentsRouter = Router();
const Dishes = require("../models/dishes");
const { verifyUser, verifyAdmin } = require("../authenticate");

//----------------------------------------------------//

dishCommentsRouter.use("/", (req, res, next) => {
	if ( req.method == "GET") return next();
	verifyUser(req, res, next);
});

dishCommentsRouter.use("/", (req, res, next) => {
	Dishes.findById(req.dishId)
	.populate('comments.author')
	.then( (dish) => {
		if (dish != null) {
    		res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			req.dish = dish;
			next();
		} else {
			err = new Error('Dish ' + req.dishId + ' is not found');
			err.status = 404;
            next(err);
		}}
		, next
	)
	.catch(next);
});

dishCommentsRouter.use("/:commentId", (req, res, next) => {

	const comment = req.dish.comments.id(req.params.commentId);

	if (!comment) {
		const err = new Error('Comment ' + req.params.commentId + ' is not found');
		err.status = 404;
		return next(err);
	}

	req.comment = comment;

	if ( req.method == "GET" || req.method == "POST" ) return next();
	if ( comment.author._id.equals(req.user._id) ) return next();

	const err = new Error(`You aren't the author of this comment!`);
	err.status = 403;
	next(err);
});

//----------------------------------------------------//

dishCommentsRouter.route("/")
.get( (req, res, next) => {
	res.json(req.dish.comments);
})
.post( (req, res, next) => {
	req.body.author = req.user._id;
	req.dish.comments.push(req.body);
	next();
})
.put( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
    res.end(`PUT operation is not supported on /dishes/${req.dishId}/comments`);
})
.delete( verifyAdmin, (req, res, next) => {
	req.dish.comments = [];
	next();
});

//----------------------------------------------------//

dishCommentsRouter.route("/:commentId")
.get( (req, res, next) => {
	res.json(req.comment);
})
.post( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
	res.end(`POST operation is not supported on /dishes/${req.dishId}/comments/${req.params.commentId}`);
})
.put( (req, res, next) => {
	req.comment = Object.assign(req.comment, req.body);
	next();
})
.delete( (req, res, next) => {
	req.comment.remove();
	next();
});

//----------------------------------------------------//

dishCommentsRouter.use( (req, res, next) => {
	console.log(`Dish ${req.dish.name} is saving ...`);
	req.dish.save()
	.then( (dish) => {
		return Dishes.findById(dish._id).populate("comments.author");
	})
	.then( (dish) => {
			res.json(dish);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

module.exports = dishCommentsRouter;
