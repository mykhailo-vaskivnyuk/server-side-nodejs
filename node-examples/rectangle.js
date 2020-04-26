module.exports = function(x, y, cb) {
    
    if (x <= 0 || y <= 0) {
        setTimeout(() => cb(new Error("error message"), null), 2000);
        return;
    }

    setTimeout(() => cb(null, {area: () => x * y}), 2000);
};
