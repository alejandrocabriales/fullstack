 const blogerRouter=require('express').Router()
 const Blog = require('../models/blogs')
 const logger = require('./../utils/logger')


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


blogerRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  
  response.status(204).end()
})


blogerRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
   ...body,
    likes: body.likes
  }

const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.json(updateBlog.toJSON())

})

module.exports = blogerRouter