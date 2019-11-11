const middlewares = (request, response, functions, next) => {
    if (functions.length) {
        const fun = functions.shift();
        fun(request, response, () => middlewares(request, response, functions, next));
    }
    else {
        next();
    }
}

module.exports = middlewares;