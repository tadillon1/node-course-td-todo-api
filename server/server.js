require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;  //This will set the port when running on Heroku or set it to 3000 if running locally

app.use(bodyParser.json());     // bodyParser send json to the server.

//------------------------------------CREATE TODO------------------------------------------

app.post('/todos', (req, res) => {  //Create a new todo using POST.  json is the body which is the todo information. /todo is the URL for creating new todo
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {    //save the todo to the DB
    res.send(doc);              //send the doc back to the user
  }, (e) => {
    res.status(400).send(e);    //if and error happened then send status=400 back
  });
});

//------------------------------------GET TODO------------------------------------------

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//------------------------------------GET TODO BY ID------------------------------------------
//GET /todos/123456  --> GET a single todo by ID
app.get('/todos/:id', (req, res) => { //This gets the value after the /todos/###
  var id = req.params.id;             //Set the id variable equal to the params.id from the web-call


  // validate id is valid
  //respond with 404 if not valid - Send back emptp body
  if (!ObjectID.isValid(id)) {      //validate the ID is a valid MongoDB ID.
    return res.status(404).send();  //If the id is not valid send status 404 and empty body
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {                    //Check if todo was found
      return res.status(404).send();  //If not todo was found send status 404 and empyt message back
    }

    res.send({todo});               //otherwise send the todo back to the user.
  }).catch((e) => {
    res.status(400).send();         //if there was an error, send 400 back with empty message
  });
});
//------------------------------------DELETE TODO------------------------------------------
app.delete('/todos/:id', (req, res) => {
  //get the id
  var id = req.params.id;          //Set the id variable to the params.id from the web-call

  //validate the id -> not valid? return 404
  if(!ObjectID.isValid(id)) {         //validate the ID is a valid MongoDB ID
    return res.status(404).send();  //If the id is not valid send status 404 and empty body
  }

  //remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    //success
      //if no doc, send 404
    if(!todo) {                       //check if todo was found
      return res.status(404).send();  //if no todo was found by ID send status 404 and empty message
    }

      res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
        //if doc, send doc back with 200
    //error
      //send 400 with empty body
});


//------------------------------------UPDATE TODO------------------------------------------

app.patch('/todos/:id', (req, res) => {   // PATCH is the update
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);  //This allows users to only update the text and the completed status of a todo.

  //validate the id -> not valid? return 404
  if(!ObjectID.isValid(id)) {         //validate the ID is a valid MongoDB ID
    return res.status(404).send();  //If the id is not valid send status 404 and empty body
  }

  if(_.isBoolean(body.completed) && body.completed) {  //This checks if body.completed is a boolean AND if it is set to TRUE
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

//-------------------------------------------USERS------------------------------------
//  POST /users
app.post('/users', (req, res) => {  //Create a new user using POST.  json is the body which is the user information. /user is the URL for creating new user
  var body = _.pick(req.body, ['email', 'password']);  //using lodash "pick" method to pull off the email and password from the JSON
  var user = new User(body);        //Create new User using the inforation provided in body object

  user.save().then(() => {             //save the user to the DB
    return user.generateAuthToken();  //return the Authorization Token which is created in user.js file
  }).then((token) => {
    res.header('x-auth', token).send(user); //send back the user with the token in custom 'x-auth' header.
  }).catch((e) => {
    res.status(400).send(e);
  })
});




//------------Validate user---------------------------------------------
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


//------------------------------------START SERVER------------------------------------------

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
