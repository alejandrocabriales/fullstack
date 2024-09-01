 const blogerRouter=require('express').Router()
 const Blog = require('../models/blogs')


 blogerRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogerRouter.post('/', (request, response) => {

  const blog = new Blog(request.body)
  if (!request.body.title) {
    return response.status(400).send('Bad Request')
  }
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogerRouter