const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const db = require('./api/conf/db');
const router = require('./api/routes/index');

const app = express();
const port = 3000;

app.use(logger('combined'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.getConnection();
db.getStatusCheck()
    .then(() => {
        console.log('>> db connected!');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log(`>> db connect error: ${error.message}`);
        process.exit(1);
    });

router(app);
