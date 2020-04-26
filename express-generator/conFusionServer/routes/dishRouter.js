const { Router } = require("express");
const dishRouter = Router();
const Dishes = require("../models/dishes");
const { verifyUser, verifyAdmin } = require("../authenticate");
const { cors, corsWithOptions } = require("./cors");

//----------------------------------------------------//

dishRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

dishRouter.use("/", (req, res, next) => {

	if ( req.method == "GET" ) {
		cors(req, res, next);
		return;
	}

	corsWithOptions(req, res, next);
});

//----------------------------------------------------//

dishRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyUser(req, res, next);
});

dishRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyAdmin(req, res, next);
});

//----------------------------------------------------//

dishRouter.route("/:dishId")
.get( (req,res,next) => {
	Dishes.findById(req.params.dishId)
	.then( (dish) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(dish);
		}
		, next
	)
	.catch(next);
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation is not supported on /dishes/${req.params.dishId}`);
})
.put( (req, res, next) => {
	Dishes.findByIdAndUpdate(
		req.params.dishId,
		{ $set: req.body },
		{	new: true,
			useFindAndModify: false}
	)
	.then( (dish) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(dish);
		}
		, next
	)
	.catch(next);
})
.delete( (req, res, next) => {
	Dishes.findByIdAndRemove(
		req.params.dishId,
		{ useFindAndModify: false }
	)
	.then( (result) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(result);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

dishRouter.route("/")
.get( (req,res,next) => {
	Dishes.find(req.query)
	.then( (dishes) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(dishes);
		}
		, next
	)
	.catch(next);
})
.post( (req, res, next) => {
	Dishes.create(req.body)
	.then( (dish) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(dish);
		}
		, next
	)
	.catch(next);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /dishes`);
})
.delete( (req, res, next) => {
	Dishes.deleteMany({})
	.then( (result) => {
    		res.statusCode = 200;
    		res.setHeader("Content-Type", "application/json");
			res.json(result);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

module.exports = dishRouter;
