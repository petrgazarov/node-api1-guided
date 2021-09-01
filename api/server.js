// IMPORTS AT THE TOP
const express = require('express');
const Dog = require('./dog-model');

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json());

// ENDPOINTS

//----------------------------------------------------------------------------//
// [GET] / (Hello World endpoint)
//
// This handles GET requests for the root path ('/')
//----------------------------------------------------------------------------//
server.get('/', (req, res) => {
  // the .json() method on the res object responds to the request by sending a
  // JSON object. Just FYI, this method not only sends the response back, but
  // it ensures that the response body is a stringified JSON object, and it
  // sets the Content-Type header to application/json.
  //
  // Note that some responses below call .status() to explicitly set the
  // response status code to a specific value. If you don't call .status() to
  // set the code, it will default to 200 (which is a success code).
  res.json({ message: "hello world!" });
});

//----------------------------------------------------------------------------//
// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
//
// This handler is for GET requests to fetch a specific dog.
//----------------------------------------------------------------------------//
server.get('/api/dogs/:id', async (req, res) => {
  // 1- gather info from the request object
  const { id } = req.params;

  // 2- interact with db
  Dog.findById(id)
    .then(dog => {
      // 3A- send appropriate response
      dog
        ? res.status(200).json(dog)
        : res.status(404).json({ message: `no dog with id ${id}` });
    })
    .catch(error => {
      // 3B- send appropriate response (something crashed)
      res.status(500).json({ error: error.message });
    })
})

//----------------------------------------------------------------------------//
// [GET] /api/dogs (R of CRUD, fetch all dogs)
//
// This handler is similar to the previous handler, except it returns a collection of dogs.
//----------------------------------------------------------------------------//
server.get('/api/dogs', async (req, res) => {
  // 1- gather info from the request object
  // 2- interact with db
  Dog.findAll()
    .then(dogs => {
      // 3A- send appropriate response
      res.status(200).json(dogs);
    })
    .catch(error => {
      // 3B- send appropriate response (sad path)
      res.status(500).json({ error: error.message });
    })
});

//----------------------------------------------------------------------------//
// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
//
// This handler is for POST requests to the /api/dogs collection.
//
// The POST HTTP method (verb) is typically used to create a new object in
// whatever "collection" you specify in the URL. In REST API's, the URL often
// represents a single object in a data store (like a database), or the URL can
// represent a "collection" of objects in a data store.
//
// When we want to create an object, we need to specify the "collection" the
// object is to be created in, and that is the URL we pass. The HTTP method we
// use is "POST". It's like we are saying "POST this new object to the
// collection."
//
// The data that is used to create the new object is passed in the POST request
// body as a "stringified" JSON object.
//
// In order for this "stringified" JSON object to be converted into an actual
// JSON object, it has to be processed by middleware. Above, we added such a
// middleware (aka a "handler") to the "chain" of handlers using the
// "server.use()" method.
//
// The middleware function express.json() is added to the chain with the
// server.use() call, and is applied to every request. This is a parser that
// checks to see if the body type is supposed to be "json" (looking for a
// content-type header in the HTTP request), and then converts the text of the
// body into an actual JSON object that can be accessed using req.body.
//----------------------------------------------------------------------------//
server.post('/api/dogs', async (req, res) => {
  // 1- gather info from the request object
  const dog = req.body;

  // crude validation of req.body
  if (!dog.name || !dog.weight) {
    res.status(400).json({ message: 'name and weight are required' });
  } else {
    // 2- interact with db
    Dog.create(dog)
      // 3- send appropriate response
      .then(newlyCreatedDog => res.status(201).json(newlyCreatedDog))
      .catch(error => res.status(500).json({ error: error.message }))
  }
})

//----------------------------------------------------------------------------//
// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
//----------------------------------------------------------------------------//
server.put('/api/dogs/:id', async (req, res) => {
  // 1- pull info from req
  const changes = req.body;
  const { id } = req.params;

  // crude validation of req.body
  if (!changes.name || !changes.weight) {
    res.status(400).json({ message: 'name and weight are required' });
  } else {
    // 2- interact with db through helper
    await Dog.update(id, changes)
      // 3- send appropriate response
      .then(updatedDog => {
        if (updatedDog) {
          res.status(200).json(updatedDog);
        } else {
          res.status(404).json({ message: `Could not find dog with id ${id}` });
        }
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      })
  }
})

//----------------------------------------------------------------------------//
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
//
// This handler works for DELETE '/api/dogs/:id'.
//
// Notice the "parameter" in the url... preceding a URL "part" name with a colon
// designates it as a "parameter". You can access all parameters that are
// identified in the URL using the req.params property (it's an object).
//
// These are typically "variable" parts of the url that will impact what
// response is we choose to return. In this case, the thing after "/dogs/" is
// considered to be an id, and we want to get it and search the array for it,
// returning what we find.
//
// This is similar to parameters in React routes.
//
// Making a call to DELETE /api/dogs (without an id) won't match this handler, so no
// delete will be tried. We don't have a handler for DELETE /api/dogs, and if you
// try, express() will respond with an error (basically saying "there is no
// handler for that METHOD and /url")
//----------------------------------------------------------------------------//
server.delete('/api/dogs/:id', (req, res) => {
  // 1- gather info from the request object
  const { id } = req.params;
  // 2- interact with db
  Dog.delete(id)
    .then(deleted => {
      // 3- send appropriate response
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res.status(404).json({ message: 'dog not found with id ' + id });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    })
})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;