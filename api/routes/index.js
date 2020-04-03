const todo = require('./todo');

module.exports = app => {
    app.use('/api/todo', todo);
}