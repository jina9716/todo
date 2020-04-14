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

exports.getStatusCheck = () => {
    return new Promise((resolve, reject) => {
        connection.on('error', (error) => {
            reject(error);
        });
        connection.on('open', () => {
            resolve();
        });
    });
};

// async/await 도 됨
// exports.getStatusCheck = async () => {
//     try {
//         await this.getConnection();
//     } catch (e) {
//         throw e;
//     }
// };
