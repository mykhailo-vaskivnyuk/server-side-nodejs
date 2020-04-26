const { Router } = require("express");
const leaderRouter = Router();
const Leaders = require("../models/leaders");
const { verifyUser } = require("../authenticate");
const { cors, corsWithOptions } = require("./cors");

//----------------------------------------------------//

leaderRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

leaderRouter.use("/", (req, res, next) => {

	if ( req.method == "GET" ) {
		cors(req, res, next);
		return;
	}

	corsWithOptions(req, res, next);
});

//----------------------------------------------------//

leaderRouter.use("/", (req, res, next) => {
    res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
    next();
});

leaderRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyUser(req, res, next);
});

leaderRouter.use("/", (req, res, next) => {
	if ( req.method == "GET" ) return next();
	verifyAdmin(req, res, next);
});

//----------------------------------------------------//

leaderRouter.route("/:leaderId")
.all( (req, res, next) => {
	if (req.method == "POST") return next();
	Leaders.findById(req.params.leaderId)
	.then( (leader) => 
		{
			if (leader == null) {
				err = new Error('Leader ' + req.params.leaderId + ' is not found');
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
	Leaders.findById(req.params.leaderId)
	.then( (leader) => {
			res.json(leader);
		}
		, next
	)
	.catch(next);
})
.post( verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.setHeader("Content-Type", "text/plain");
  res.end(`POST operation is not supported on /leaders/${req.params.leaderId}`);
})
.put( verifyUser, (req, res, next) => {
	Leaders.findByIdAndUpdate(
		req.params.leaderId,
		{ $set: req.body },
		{	new: true,
			useFindAndModify: false}
	)
	.then( (leader) => {
			res.json(leader);
		}
		, next
	)
	.catch(next);
})
.delete( verifyUser, (req, res, next) => {
	Leaders.findByIdAndRemove(
		req.params.leaderId,
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

leaderRouter.route("/")
.get( (req, res, next) => {
	Leaders.find(req.query)
	.then( (leaders) => {
			res.json(leaders);
		}
		, next
	)
	.catch(next);
})
.post( verifyUser, (req, res, next) => {
	Leaders.create(req.body)
	.then( (leader) => {
			res.json(leader);
		}
		, next
	)
	.catch(next);
})
.put( verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.setHeader = ("Content-Type", "text/plain");
    res.end(`PUT operation is not supported on /leaders`);
})
.delete( verifyUser, (req, res, next) => {
	Leaders.deleteMany({})
	.then( (result) => {
			res.json(result);
		}
		, next
	)
	.catch(next);
});

//----------------------------------------------------//

module.exports = leaderRouter;
