const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server');   //create connection to web server
const {Todo} = require('./../models/todo');  //create connection to Todo model in mongoose

beforeEach((done) => {            //Run some code before each test case...  only moves onto the test case once "done"
  Todo.remove({}).then(() => done());  //Delete all DB objects before running each test case.
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

      Todo.find().then((todos) => { //fetch all of the todos from MonboDB
        expect(todos.length).toBe(1);  //Expect the length to be 1
        expect(todos[0].text).toBe(text);  //Expect the first document to be "text"
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo with invalid body data', (done => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  }))
});
