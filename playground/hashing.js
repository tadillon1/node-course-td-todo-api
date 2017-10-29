//This example shows how to create a user token with 256bit hashing and salting to prevent 3rd party access
// This hashing model is ONE WAY hashing.  Passwords are hashed and stored in DB
//When user types in their passsord, it is hashed and validated against the hash stored in the DB
//This prevents passwords being stored in plain text.



const {SHA256} = require('crypto-js');  //npm install crypto-js --save



// var message = "I am user number 3";   //example string
// var hash = SHA256(message).toString(); //example hash of the string
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {      //variable object with ID
//   id: 4
// };
// var token = {     //variable token where the ID is hashed with "somesecret" as a salt to include in the hash
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()  //This is the hashed ID with secret salt string.
// };
//
//
// token.data.id = 5   //This is an example of a MAN in the MIDDLE attempt
// token.hash = SHA256(JSON.stringify(token.data)).toString();  //They do NOT know the salt string
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("data was changed.  Do not trust!!!");
// }

//--------------------------------------------------------------------------------

//*****  REAL MODULE IS CALLED JSONWEBTOKEN
//
// const jwt = require('jsonwebtoken'); //npm install JSONWEBTOKEN
//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');      //takes ID and signs it with 123abc salt, returing the token.
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');    //takes the token and the secret and validates it...
// console.log('decoded', decoded);

//--------------------------------------------------------------------------------------------
const bcrypt = require('bcryptjs');
var password = 'abc123!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$cRRkBZghOhOSqEc6.u44feuo8H06Ehwim4B2v3nEFK7ILakfkpzsS';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})
