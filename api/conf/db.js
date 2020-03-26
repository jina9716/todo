'use strict';

const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost:27017/local', {useNewUrlParser: true, useUnifiedTopology: true});

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db connection error:'));
    db.once('open', function() {
        console.log('db connected!!')
    });
}