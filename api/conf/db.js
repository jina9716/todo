const mongoose = require('mongoose');

mongoose.conn = mongoose.createConnection('mongodb://localhost:27017/local', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.conn.on('error', error => {
    console.error('db connection error: ', error.message);
    process.exit(1);
});
mongoose.conn.on('open', () => {
    console.log('db connected!!');
});

module.exports = mongoose;