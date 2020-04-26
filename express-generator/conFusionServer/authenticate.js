const Users = require("./models/users");
const JWT = require("jsonwebtoken");
//-------------------------------------------------//
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const FacebookTokenStrategy = require("passport-facebook-token");
//-------------------------------------------------//

const config = require("./config");

//-------------------------------------------------//

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//-------------------------------------------------//

exports.getToken = (user) => JWT.sign(user, config.secretKey, { expiresIn: 3600});

//-------------------------------------------------//

const options = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey
};

passport.use(new JWTStrategy(options, (jwt_payload, done) => {
	console.log("JWT: ", jwt_payload);
	Users.findOne({ _id: jwt_payload._id})
	.then( (user) => {
		if ( user ) return done(null, user);
		return done(null, false)
	}, (err) => done(err, false))
	.catch( (err) => done(err, false));
}));

exports.verifyUser = passport.authenticate("jwt", { session: false });

//-------------------------------------------------//

exports.verifyAdmin = (req, res, next) => {
	
	if ( req.user.admin ) return next();

	const err = new Error("You have not permission for this operation!");
	err.status = 403;
	next(err);
};

//-------------------------------------------------//

const fb_options = {
	clientID: config.facebook.clientId,
	clientSecret: config.facebook.clientSecret
};

passport.use(new FacebookTokenStrategy(fb_options,
	(accessToken, refreshToken, profile, done) => {
	Users.findOne({ facebookId: profile.id })
	.then( (user) => {

		if ( user ) return done(null, user);

		console.log(profile);

		Users.create({
			username: profile.displayName,
			facebookId: profile.id,
			firstname: profile.name.giveName,
			lastname: profile.name.familyName
		})
		.then( 
			(user) => done(null, user),
			(err) => done(err, false)
		);

	}, (err) => done(err, false))
	.catch( (err) => done(err, false));

}));

exports.facebookToken = passport.authenticate("facebook-token");
