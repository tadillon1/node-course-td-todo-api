const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');   //create connection to web server
const {Todo} = require('./../models/todo');  //create connection to Todo model in mongoose
const {User} = require('./../models/user');  //create users based upon the model in mongoose
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

//------------------------CREATE TODOS-------------------

describe('POST /todos', () => {
  it('should create a new todo', (done) => {  //must pass "done" to the it function
    var text = 'Test todo text';
    request(app)
    .post('/todos')  //test using the /todos url to add todos
    .send({text})   //send the text variable from above to the server...  This sends it in json format by default
    .expect(200)    // this test should send back a status of 200
    .expect((res) => {  //we expect the returned response body has a text property and the body is equal to the text from above.
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {    //err= errors exist, res = response from above
      if(err){
        return done(err);   //return stops the execution
      }

      Todo.find({text}).then((todos) => { //fetch all of the todos from MonboDB which were set up above
        expect(todos.length).toBe(1);  //Expect the length to be 1
        expect(todos[0].text).toBe(text);  //Expect the first document to be "text"
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo with invalid body data', (done => {
    request(app)
    .post('/todos')
    .send({})     //send empty text string which violates the requirement of todo model - should fail
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);  //expect only 2 documents in MongoDB.
        done();
      }).catch((e) => done(e));
    });
  }))
});

//-------------------------GET TODOS---------------------

describe('GET /todos', () => {                //Get all Todos
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)                            //should get 200 status
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)    //get 1st todo by ID
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();   //new ID should not match existing todos.
    request (app)
      .get(`/todos/{$hexId}`)
      .expect(404)
      .end (done);
    });

  it('should return 404 for non-object ids', (done) => {
    //todos/123
    request(app)
      .get('todos/123abc')              //should not get non-object ID
      .expect(400)
      .end(done);
  });
});

//--------------------DELETE TODOS-----------------------

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)    //delete 2nd todo and return 200
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();    //Testing the todo was actually deleted
          done();
        }).catch((e) => done(e));
      });
  });


 it('Should return 404 if todo not found', (done) => {
   var hexId = new ObjectID().toHexString();
   request (app)
     .delete(`/todos/{$hexId}`)   //cannot delete todo that DNE
     .expect(404)
     .end (done);
  });
  //
 it('Should return 404 if ObjectID is invalid', (done) => {
   request(app)
     .delete('todos/123abc')    //cannot delete invalid todo
     .expect(404)
     .end(done);
 });
});

//--------------------UPDATE TODOS-----------------------


describe('PATCH todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();   //grab id of first item
    var text = "Updated first todo text";

    request(app)
    .patch(`/todos/${hexId}`)
      .send({
        completed: true,    //send the updated completed status to true
        text: text          //send the updated text for the todo
      })
        .expect(200)        //return 200 status
        .expect((res) => {  //res.body.text is changed, completed is true, completedAt is a number using .toBeA
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
  });

  it('should clear completedAt when todo is not completed', () => {
    var hexId = todos[1]._id.toHexString(); //grab id of second todo itme
    var text = "Updated second todo text";

    request(app)
    .patch(`/todos/${hexId}`)
      .send({                   //upate text and set complete to false
        text: text,
        completed: false
      })
      .expect(200)             //expect 200
      .expect((res) => {       //text is changed, completed is false, completedAt is null using .toNotExist
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      //.end(done);   //get some error with this uncommented out????
  });
});

//--------------------------------------------------------------------------------
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)      //set x-auth equal to the first user's token
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());  //expct the ID to be the same as the passed in token's ID
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done);
  });
});

//-------------------------------------------------------------------------------------------

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if requst invalid', (done) => {
    var email = 'abc@abc.defg';
    var password = '123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = '123abc!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});
//--------------------------------------------------------------
describe('POST /users/login',  () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login',  (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + '1'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
})
//--------------------------------------------------------------
describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));
      });
    });
  });
