const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59af186114efc615a47908e611'; //Todo's ObjectID in MongoDB
var id = '59a5af8ceda4cc180bd4967f';  //User's ObjectID in MongoDB
//
// if(!ObjectID.isValid(id)) {   //validate the ID is a valid MongoDB ID.
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id           //returns an ARRAY with one document matching the ID
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({      //returns the DOCUMENT instead of the array of documents.
//   _id: id           //find the document which matches the ID set above.
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
  if(!user) {
    return console.log("User Not Found");
  }
  console.log('User: ', user);
}).catch((e) => console.log(e));
