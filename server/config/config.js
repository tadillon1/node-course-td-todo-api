var env = process.env.NODE_ENV || 'development';


if (env === 'development' || env === 'test') {
  var config = require('./config.json');  //This returns both test and development objects.
  var envConfig = config[env];  //grab either test or development properties fromt the config.json file
  Object.keys(envConfig).forEach((key) => {  //This is similar to a for loop for each of the properties in the envConfig variable.
    process.env[key] = envConfig[key];  //This sets the process.env.port and the Process.env.mongodburi environment variable based on environment.
  });
}


// if(env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
// else {
//   //process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://tadillon:Michelle1!@ds149124.mlab.com:49124/todoapi_td';
// }
