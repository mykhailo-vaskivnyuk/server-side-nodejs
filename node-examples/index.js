const rect = require("./rectangle");

function solveRect(l, b,) {
    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            console.log(`Rectangle's area [%s:%s]: %s !`, l, b, rectangle.area());
        }
    })
    
    console.log("This statement is after the call to ract()");
}

solveRect(-5, 10);
solveRect(5, 10);