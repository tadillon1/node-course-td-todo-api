{
  "name": "node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha ./server/**/*.test.js",
    "test-watch": "nodemon --exec 'npm test'"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.17.2",
    "express": "^4.15.4",
    "mongodb": "^2.2.31",
    "mongoose": "^4.5.9"
  },
  "devDependencies": {
    "expect": "^1.20.2",
    "mocha": "^3.5.0",
    "nodemon": "^1.11.0",
    "supertest": "^3.0.0"
  }
}
git s
