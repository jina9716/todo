const mongoose = require('mongoose');

let connection;
exports.getConnection = () => {
    if (!connection) {
        connection = mongoose.createConnection('mongodb://localhost:27017/local', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return connection;
};

exports.getStatus = async () => {
    try {
        await this.getConnection();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
