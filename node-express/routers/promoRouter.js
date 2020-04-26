const { Router } = require("express");
const bodyParser = require("body-parser");

const promoRouter = Router();

promoRouter.use(bodyParser.json());

promoRouter.use("/", (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
});

//----------------------------------------------------//

promoRouter.route("/:promoId")
.get( (req,res,next) => {
    res.end(`Will send details of the promotion: ${req.params.promoId} to you!`);
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
})
.put( (req, res, next) => {
	res.write(`Updating the promotion: ${req.params.promoId}\n`);
	res.write(`Will update the promotion: ${req.body.name}\n`);
	res.end(`with details: ${req.body.description}`);
})
.delete( (req, res, next) => {
    res.end(`Deleting promotion: ${req.params.promoId}`);
});

//----------------------------------------------------//

promoRouter.route("/")
.get( (req, res, next) => {
    res.end(`Will send all the promotions to you!`);
})
.post( (req, res, next) => {
	res.write(`Will add the promotion: ${req.body.name}\n`);
	res.end(`with details: ${req.body.description}`);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions`);
})
.delete( (req, res, next) => {
    res.end(`Deleting all promotions`);
});

//----------------------------------------------------//

module.exports = promoRouter;
