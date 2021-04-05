// IMPORTS AT THE TOP
const express = require("express")
const Dog = require("./dog-model.js")
//const {create, findAll, findById } = require("./dog-model.js")

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS  req is talking to the server     res is the response given to the client


// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id",(req,res)=>{
    const idVar = req.params.id
    // const {id} = req.params
    Dog.findById(idVar)
        .then(dog=>{
            if(!dog){
                res.status(404).json("Dog not found")
            }else{
                res.status(200).json(dog)
            }            
        })
        .catch(err=>{
            res.status(500).json({message: err.message})
        })
})

// [GET] /api/dogs (R of CRUD, fetch all dogs)
server.get("/api/dogs",(req,res)=>{
    Dog.findAll()
        .then(dogs =>{
            console.log(dogs)
            res.status(200).json(dogs)
        })
        .catch(err=>{
            res.status(500).json({message: err.message})
        })
})
// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", (req,res)=>{
    const newDog = req.body
    if(!newDog.name || !newDog.weight){
        res.status(422).json("Name and weight required")
    }else{
        Dog.create(newDog)
        .then(dog=>{
            res.status(201).json(dog)
        })
        .catch(err=>{
            res.status(500).json({message: err.message})
        })
    }    
})
// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req,res)=>{
    const {id} = req.params
    const changes = req.body

    try{
        const updatedDog = await Dog.update(id,changes)
        res.status(201).json(updatedDog)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)


// [GET] / (Hello World endpoint)
server.use("*",(req,res)=>{
    res.status(404).json({message:"Princess is in another castle"})
})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
