const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//Remove all Todos from MongoDB
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


//Remove one Todo to an atributute of the Todo schema, in this case it is the _id property
Todo.findOneAndRemove({_id: '59d512f43936f0b65647c33b'}).then((todo) => {
  console.log(todo);
});

//Remove one Todo by using the matching _id property text attribute.
Todo.findByIdAndRemove('59d512f43936f0b65647c33b').then((todo) => {
  console.log(todo)
});
