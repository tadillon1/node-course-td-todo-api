const mongoose = require('mongoose');
const  validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//   email: 'terry@example.com',
//   password: 'asdfasdf8sad9f8sadf987asd9f8'  //hash password stored in DB
//   tokens: [{
//     access: 'auth',                         //authentication token type
//     token: 'ksdkfjsdkfjsdfkjsdf 98usd9f78sd9f8'  //string passed back and fourth for http requests
//   }]
// }

var UserSchema = new mongoose.Schema({    //defines the schema for a user
    email: {          //EVERY USER WILL HAVE AN EMAIL ADDRESS
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
    password: {       //EVERY USER WILL HAVE A PASSWORD
      type: String,   //password is of type string
      required: true, //password is required for all Users
      minlength: 6    //minimum length for password is 6 characters
    },
    tokens: [{        //EVERY USER WILL HAVE A TOKENS ARRAY
      access: {       //Token array is made up of two objects: Access and Token
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

UserSchema.methods.toJSON = function () {   //This function limits the amount of information returned to the user.
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);  //Send only _id and email.  DON'T SEND TOKEN INFORMATION BACK
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

//-------------------------------------------------------------
UserSchema.statics.findByToken = function (token) {   //Provides a method for finding a user by the passed in token
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');  //This decodes the x-auth header token to see if there are any matches
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({          //Find the associated user where the token and auth match the decoded values and return that user
    '_id': decoded._id,           //Find the _id propery which matches
    'tokens.token': token,      //Find the token in the tokens array which matches
    'tokens.access': 'auth'     //Find the auth in the tokens array which matches
  });
};
//-------------------------------------------------------------------

var User = mongoose.model('User', UserSchema );

module.exports = {User};
