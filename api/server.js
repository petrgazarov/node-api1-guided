// IMPORTS AT THE TOP
const express = require('express');
const Dog = require('./dog-model');

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json());

// ENDPOINTS

// [GET] / (Hello World endpoint)
server.get('/', (req, res) => {
  res.status(200);
  res.type('text/plain');
  res.send('Hello World from Express Node Server');
});
// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
// [GET] /api/dogs (R of CRUD, fetch all dogs)
server.get('/api/dogs', (req, res) => {
  // 1. Gather info from request
  // 2. Interact with the DB
  Dog.findAll()
    // 3. Send appropriate response
    .then(dogs => {
      res.status(200).json(dogs);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});
// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;