var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://tadillon:Michelle1!@ds149124.mlab.com:49124/todoapi_td' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
