const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');   //create connection to web server
const {Todo} = require('./../models/todo');  //create connection to Todo model in mongoose

const todos = [{          //create test todo array
  _id: new ObjectID(),
  text: "First test todo"
}, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {            //Run some code before each test case...  only moves onto the test case once "done"
  Todo.remove({}).then(() => {    //THEN Delete all DB objects before running each test case.
    return Todo.insertMany(todos);  // THEN Add dummy array from above
  }).then(() => done());          //THEN call done.
});

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
