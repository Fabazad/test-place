const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const s3Routes = require('./routes/s3.routes');
const testRoutes = require('./routes/test.routes');
const path = require('path');
path.resolve(__dirname, './SSL/key.key');

async function routes (app) {
    app.use("/api/user", userRoutes);
    app.use("/api/product", productRoutes);
    app.use('/api/s3', s3Routes);
    app.use('/api/test', testRoutes);
}

module.exports = routes;
