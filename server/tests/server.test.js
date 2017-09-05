const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server');   //create connection to web server
const {Todo} = require('./../models/todo');  //create connection to Todo model in mongoose

const todos = [{
  text: "First test todo"
}, {
  text: "Second test todo"
}];

beforeEach((done) => {            //Run some code before each test case...  only moves onto the test case once "done"
  Todo.remove({}).then(() => {    //THEN Delete all DB objects before running each test case.
    return Todo.insertMany(todos);  // THEN Add dummy array from above
  }).then(() => done());          //THEN call done.
});

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


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
