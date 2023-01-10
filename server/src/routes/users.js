const express = require("express")
require("dotenv").config()
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { verifyJWT } = require("../utils")
const Users = require("../models/users")

router.get("/getUser", verifyJWT, async (req, res) => {
  const { username } = req.query
  const result = await Users.find({username})

  if(result) {
    res.status(200).send(result)
  } else {
    res.status(500).send({message: "Error"})
  }

})

router.post("/signup", async (req, res) => {
  const {username, password} = req.body

  const salt = await bcrypt.genSalt(10)
  const hashPass = await bcrypt.hash(password, salt)

  const result = await Users.insertMany({username,password: hashPass})

  if(result) {
    res.status(200).send({message: "Successfully signup"})
  } else {
    res.status(500).send({message: "Error signup"})
  }
})

router.post("/login", async (req, res) => {
  const {username, password} = req.body
  const result = await Users.find({username})

  if(result.length > 0 && await bcrypt.compare(password, result[0].password)) {
    const token = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30d"})
    res.status(200).send({message: "Login Successfully", accessToken: token})
  } else {
    res.status(500).send({message: "Error login"})
  }

})

router.post("/logout", verifyJWT, async (req, res) => {
  res.json({
    message: "Logout Successfully",
    accessToken: null
  })
})

router.post("/addTodos", verifyJWT, async (req, res) => {
  const { username, todos } =  req.body
  const result = await Users.findOneAndUpdate({username}, {$push: {todos}})
  
  if(result) {
    res.status(200).send({message: "Added todos", result: todos})
  } else {
    res.status(500).send({message: "Error"})
  }
})

router.post("/removeTodo", verifyJWT, async (req, res) => {
  const { username, todo } = req.body
  const result = await Users.findOneAndUpdate({username}, {$pull: {todos: todo}})

  if(result) {
    res.status(200).send({message: "Removed todo", result: todo})
  } else {
    res.status(500).send({message: "Error"})
  }
})

module.exports = router