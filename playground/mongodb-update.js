//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server.');
  }
  console.log('Connected to MongoDB server.');

// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID('59a3a51f1ef6d7e3881dd887')
// }, {
//   $set: {
//     completed: true
//   }
// }, {
//     returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });

db.collection('Users').findOneAndUpdate({
  name: 'Jen'
}, {
    $set: {
      name: 'Terry'
    },
      $inc: {
        age: 1
      }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });



  //db.close();
});
