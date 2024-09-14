const userRouter=require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt');


userRouter.get('/', async (request, response) => {
  const resultUsers= await  User.find({}).populate('blog')
  response.json(resultUsers)   
  })


userRouter.post('/',async (request, response, next) => {
const {password, name, username}=request.body


const userExists = await User.findOne({ username })
if (userExists) {
  return response.status(400).send({ error: 'username must be unique' })
}

if(password.length<=3){  
  return response.status(400).send({error: 'password should be at least 3 characters long'})
}

try {
  const user = new User({
    name,
    username,
    passwordHash: bcrypt.hashSync(password, 10)
 })
 const result = await user.save()
response.status(201).json(result) 
} catch (error) {
  next(error)
}
 
})



module.exports = userRouter