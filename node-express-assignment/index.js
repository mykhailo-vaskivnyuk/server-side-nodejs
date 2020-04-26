const express = require("express");
const morgan = require("morgan");
//----------------------------------------------------//
const dishRouter = require("./routers/dishRouter");
const promoRouter = require("./routers/promoRouter");
const leadersRouter = require("./routers/leaderRouter");
//----------------------------------------------------//

const hostname = "localhost";
const port = 3000;
const app = express();

//----------------------------------------------------//

app.use(morgan("dev"));

//----------------------------------------------------//

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leadersRouter);

//----------------------------------------------------//

app.use(express.static(__dirname + "/public"));

//----------------------------------------------------//

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<html><body><h1>PAGE NOT FOUND</h1></body></html>");
});

//----------------------------------------------------//

app.listen(port, hostname, () => {
	console.log("Server is running on http://%s:%s", hostname, port);
});
