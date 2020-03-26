'use strict';

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const logger = require('morgan');

app.use(logger('combined'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const todo = require('./api/routes/index');
app.use('/api/todo', todo);

const db = require('./api/conf/db');
db(); 

app.listen(port);