var express = require('express');
var router = express.Router();
const Users = require("../models/users");

const passport = require("passport");
const { getToken, verifyUser, verifyAdmin, facebookToken } = require("../authenticate");

const { corsWithOptions } = require("./cors");

//----------------------------------------------------//

router.options("*", corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

router.use("/", corsWithOptions);

//----------------------------------------------------//

/* GET users listing. */
router.get('/', verifyUser, verifyAdmin, function(req, res, next) {
	Users.find({})
	.then( (users) => {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json(users);
		}
		, next
	)
	.catch(next);
});

router.post("/signup", (req, res, next) => {

	Users.register(
		new Users({ username: req.body.username })
		, req.body.password
		, (err, user) => {

			if ( err ) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: false, status: "Registration is failed!", err: err });
				return;
			}

			const { firstname = "", lastname = "" } = req.body;
			Object.assign(user, { firstname, lastname });

			user.save()
			.then( () => {
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, status: 'Registration is successful!', err: null });
				})
			})
			.catch( (err) => {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: false, status: "Registration is failed!", err: err });
				return;
			});
		}
	);
});

router.post("/login", (req, res, next) => passport.authenticate("local", (err, user, info) => {

	if ( err ) return next(err);
	
	if ( !user ) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: false, status: 'Login is unsuccessful!', err: info });
		return;
	}
	
	req.logIn(user, (err) => {
		if ( err ) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: false, status: 'Login is unsuccessful!', err: 'Could not log in user!' }); 
			return;        
		}
	
		const token = getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: true, token: token, status: 'You are logged in successfully!', err: null });
	});
})(req, res, next));

router.get("/logout", (req, res, next) => {

	if (!req.user) {
		const err = new Error(`You are not logged in!`)
		err.status = 403;
		return next(err);
	}

	res.redirect("/");

});

router.get("/facebook/token", facebookToken, (req, res, next) => {
	
	console.log("FACEBOOK");
	const token = getToken({ _id: req.user._id });

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are logged in successfully!', err: null });

});

router.get('/checkJWTtoken', (req, res, next) => passport.authenticate('jwt', { session: false}, (err, user, info) => {
	  
	if ( err ) return next(err);
	  
	if ( !user ) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: false, status: 'JWT is invalid!', err: info });
		return;
	}

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'JWT valid!', err: null, user: user });
  
})(req, res, next));

module.exports = router;
