const { Router } = require("express");
const promoRouter = Router();
const Promotions = require("../models/promotions");
const { verifyUser } = require("../authenticate");
const { cors, corsWithOptions } = require("./cors");

//----------------------------------------------------//

promoRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

promoRouter.use("/", (req, res, next) => {

	if ( req.method == "GET" ) {
		cors(req, res, next);
		return;
	}

	corsWithOptions(req, res, next);
});

//----------------------------------------------------//

promoRouter.use("/", (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
});

promoRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyUser(req, res, next);
});

promoRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyAdmin(req, res, next);
});

//----------------------------------------------------//

promoRouter.route("/:promoId")
.all( (req, res, next) => {
	if (req.method == "POST") return next();
	Promotions.findById(req.params.promoId)
	.then( (promo) => 
		{
			if (promo == null) {
				err = new Error('Promotion ' + req.params.promoId + ' is not found');
				err.status = 404;
            	return next(err);
			}
			next();
		}
		, next
	)
	.catch(next);
})
.get( (req, res, next) => {
	Promotions.findById(req.params.promoId)
	.then( (promo) => {
			res.json(promo);
		}
		, next
	)
	.catch(next);
})
.post( verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.setHeader("Content-Type", "text/plain");
  res.end(`POST operation is not supported on /promotions/${req.params.promoId}`);
})
.put( verifyUser, (req, res, next) => {
	Promotions.findByIdAndUpdate(
		req.params.promoId,
		{ $set: req.body },
		{	new: true,
			useFindAndModify: false}
	)
	.then( (promo) => {
			res.json(promo);
		}
		, next
	)
	.catch(next);
})
.delete( verifyUser, (req, res, next) => {
	Promotions.findByIdAndRemove(
		req.params.promoId,
		{ useFindAndModify: false }
	)
	.then( (result) => {
			res.json(result);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

promoRouter.route("/")
.get( (req, res, next) => {
	Promotions.find(req.query)
	.then( (promotions) => {
			res.json(promotions);
		}
		, next
	)
	.catch(next);
})
.post( verifyUser, (req, res, next) => {
	Promotions.create(req.body)
	.then( (promo) => {
			res.json(promo);
		}
		, next
	)
	.catch(next);
})
.put( verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.setHeader = ("Content-Type", "text/plain");
    res.end(`PUT operation is not supported on /promotions`);
})
.delete( verifyUser, (req, res, next) => {
	Promotions.deleteMany({})
	.then( (result) => {
			res.json(result);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

module.exports = promoRouter;
