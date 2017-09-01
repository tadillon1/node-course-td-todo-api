const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());  //Delete all DB objects before running each test case.
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')  //test using the /todos url
    .send({text})   //send the text variable from above...  This sends it in json format by default
    .expect(200)    // this test should send back a status of 200
    .expect((res) => {  //we expect the returned response body has a text property and the body is equal to the text from above.
      expect(res.body.text).tobe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo with invalid body data', (done => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((erro, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().find((todos) => {
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  }))
});
