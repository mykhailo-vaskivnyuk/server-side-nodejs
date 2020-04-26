const { Router } = require("express");
const bodyParser = require("body-parser");

const dishRouter = Router();

dishRouter.use(bodyParser.json());

dishRouter.use("/", (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
});

//----------------------------------------------------//

dishRouter.route("/:dishId")
.get( (req,res,next) => {
    res.end(`Will send details of the dish: ${req.params.dishId} to you!`);
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
})
.put( (req, res, next) => {
	res.write(`Updating the dish: ${req.params.dishId}\n`);
	res.write(`Will update the dish: ${req.body.name}\n`);
	res.end(`with details: ${req.body.description}`);
})
.delete( (req, res, next) => {
    res.end(`Deleting dish: ${req.params.dishId}`);
});

//----------------------------------------------------//

dishRouter.route("/")
.get( (req, res, next) => {
    res.end(`Will send all the dishes to you!`);
})
.post( (req, res, next) => {
	res.write(`Will add the dish: ${req.body.name}\n`);
	res.end(`with details: ${req.body.description}`);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes`);
})
.delete( (req, res, next) => {
    res.end(`Deleting all dishes`);
});

//----------------------------------------------------//

module.exports = dishRouter;
