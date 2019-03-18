const express = require('express');
const app = express();
const swagger = require('swagger-express-router');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const userRouter = require('./src/routes/userRouter');
const adminRouter = require('./src/routes/adminRouter');
const bodyParser = require('body-parser');
const config = require('./src/config/config');
const mongoose = require('./src/config/connection');
const path = require('path')
app.use(bodyParser.json({ limit:"50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const useBasePath = true; //whether to use the basePath from the swagger document when setting up the routes (defaults to false)
const middlewareObj = {
    'users':userRouter,
    'admin':adminRouter
};
swagger.setUpRoutes(middlewareObj, app, swaggerDocument, useBasePath);
var options = {
    explorer : true
};

app.use(express.static(path.join(__dirname, '/uploads')));

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(config.PORT, ()=>{
    console.log("server listen on port ", 3000);
})