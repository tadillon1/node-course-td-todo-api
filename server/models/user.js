const mongoose = require('mongoose');
const  validator = require('validator');

// {
//   email: 'terry@example.com',
//   password: 'asdfasdf8sad9f8sadf987asd9f8'  //hash password stored in DB
//   tokens: [{
//     access: 'auth',                         //authentication token type
//     token: 'ksdkfjsdkfjsdfkjsdf 98usd9f78sd9f8'  //string passed back and fourth for http requests
//   }]
// }

var User = mongoose.model('User', {
  email: {
    type: String,   //type of email is of string
    required: true, //required parameter
    minlength: 1,   //minimum length for validation
    trim: true,     //remove all trailing spaces
    unique: true,   //validate email is unique for all emails in db users
    validate: {
      validator: (value) => {     //npm install validator --save
        return validator.isEmail(value);  //Returns TRUE if valid email FALSE otherwise
      },
      message: `{value} is not a valid email`
    }
  },
  password: {
    type: String,   //password is of type string
    required: true, //password is required for all Users
    minlength: 6    //minimum length for password is 6 characters
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = {User};
