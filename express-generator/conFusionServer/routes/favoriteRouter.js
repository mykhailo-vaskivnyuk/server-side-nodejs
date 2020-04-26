const { Router } = require("express");
const favoriteRouter = Router();
const Favorites = require("../models/favorites");
const { verifyUser } = require("../authenticate");
const { corsWithOptions } = require("./cors");

//----------------------------------------------------//

favoriteRouter.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

favoriteRouter.use("/", corsWithOptions);

//----------------------------------------------------//

favoriteRouter.use(verifyUser);

// check req.body.dishes (req.body.dishes = [req.params.dishId] for "/:dishId")
// if wrong entry or empty -> err
// do post("/") and post("/:dishId") similarly

favoriteRouter.post("*", (req, res, next) => {
	Favorites.findOne({ user: req.user._id })
	.then( (favorites) => {
		if ( favorites ) {
			req.favorites = favorites;
			return next();
		}
		Favorites.create({ user: req.user._id })
		.then( (favorites) => {
			req.favorites = favorites
			return next();
		}, next)
		.catch(next);
	}, next)
	.catch(next);
});

favoriteRouter.route("/")
.all( (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	next();
})
.get( (req, res, next) => {
	Favorites.findOne({ user: req.user._id })
	.populate(["user", "dishes"])
	.then( (favorites) => {
		res.json(favorites);
	}, next)
	.catch(next);
})
.post( (req, res, next) => {
		req.body.forEach( dish => {
			if ( req.favorites.dishes.find( (dish_id) => 
					dish_id.equals(dish._id)
				) === undefined) {
				
				req.favorites.dishes.push(dish._id);
			}
		});
		req.favorites.save()
		.then( (favorites) => {
			req.favorites = favorites;
			next();
		}, next)
		.catch(next);
})
.put( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
	res.end(`POST operation is not supported on /favorites`);
})
.delete( (req, res, next) => {
	Favorites.findOneAndRemove(
		{ user: req.user._id },
		{ useFindAndModify: false }
	)
	// .populate(["user", "dishes"])
	.then( (favorites) => {
		res.json(favorites);
	}, next)
	.catch(next);
});

favoriteRouter.route("/:dishId")
.all( (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	next();
})
.get( (req, res, next) => {
	Favorites.findOne({ user: req.user._id })
	.then( (favorites) => {
		if (!favorites) {
			res.json({ "exists": false, "favorites": favorites });
		} else if ( favorites.dishes.find( (dish_id) => dish_id.equals(req.params.dishId)) ) {
			res.json({ "exists": true, "favorites": favorites });
		} else {
			res.json({ "exists": false, "favorites": favorites });
		}
	}, next)
	.catch(next);
})
.post( (req, res, next) => {
	if ( req.favorites.dishes.find( (dish_id) => 
		dish_id.equals(req.params.dishId)) == undefined) {
		req.favorites.dishes.push(req.params.dishId);
	}
	req.favorites.save()
	.then( (favorites) => {
		req.favorites = favorites;
		next();
	}, next)
	.catch(next);
})
.put( (req, res, next) => {
	res.statusCode = 403;
	res.setHeader("Content-Type", "text/plain");
	res.end(`PUT operation is not supported on /favorites/${req.params.dishId}`);
})
.delete( (req, res, next) => {
	Favorites.findOne({ user: req.user._id })
	.then( (favorites) => {

		if ( !favorites ) {
			res.json(favorites);
			return;
		}

		const dishes = favorites.dishes
			.filter( (dish_id) => 
				!dish_id.equals(req.params.dishId)
		);

		if ( !dishes.length ) {
			favorites.remove()
			.then( () => {
				Favorites.findOne({ user: req.user._id })
				.then( (favorites) => {
					res.json(favorites);
				}, next)
				.catch(next);
			}, next)
			.catch(next);
		} else {
			favorites.dishes = dishes;
			favorites.save()
			.then( (favorites) => {
				req.favorites = favorites;
				next();
			}, next)
			.catch(next);
		}

	}, next)
	.catch(next);
});

favoriteRouter.use( (req, res, next) => {
	Favorites.findById(req.favorites._id)
	.populate(["user", "dishes"])
	.then(res.json, next)
	.catch(next);
});

module.exports = favoriteRouter;
