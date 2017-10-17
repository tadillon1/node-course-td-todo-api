var mongoose = require('mongoose');

//mongoose.connect('mongodb://tadillon:Michelle1!@ds149124.mlab.com:49124/todoapi_td');
//mongoose.connect('mongodb://tadillon:Michelle1!@ds149124.mlab.com:49124/todoapi_td' || 'mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
