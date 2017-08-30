//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server.');
  }
  console.log('Connected to MongoDB server.');

//deleteMany - Deletes all occurances documents with "Eat lunch"
// db.collection('Todos').deleteMany({text: "Eat Lunch"}).then((result) => {
//   console.log(result);
// });

//deleteOne - Delete the FIRST occurance of a document with "Eat lunch"
// db.collection('Todos').deleteOne({text: "Eat Lunch"}).then((result) => {
//   console.log(result);
// });

//findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// })

// db.collection('Users').deleteMany({name: 'Andrew'}).then((result) => {
//   console.log(result);
// });

// db.collection('Users').findOneAndDelete({_id: new ObjectID('599363dd89cc480fc8467fb3')}). then((result) => {
//   console.log(result);
// });



  //db.close();
});
