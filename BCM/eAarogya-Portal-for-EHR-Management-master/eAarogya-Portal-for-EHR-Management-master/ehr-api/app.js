var express = require('express');
var app = express();


var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');


var EHRController = require('./ehrController');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/ehr', EHRController);

module.exports = app;