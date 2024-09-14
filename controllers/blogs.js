const blogerRouter=require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogerRouter.get('/', (request, response) => {
  Blog
    .find({}).populate('user')
    .then(blogs => {
      response.json(blogs)
    })
})

blogerRouter.post('/',middleware.userExtractor, async (request, response) => {
  const userId=request.user 
  
  if (!request.body.title) {
    return response.status(400).send('Bad Request')
  }
  
  const body = request.body

  const user = await User.findById(userId)
  
  const newBlog = new Blog({
    author: body.author,
    likes: body.likes,
    title: body.title,
    url: body.url,
    user: user.id
  })
const result = await newBlog.save()
  
user.blog = user.blog.concat(result._id);
      await user.save()
      response.status(201).json(result)
  
})
blogerRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id;
  
  const userId = request.user
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user && blog.user.toString() !== userId.toString()) {
    return response.status(403).json({ error: 'Only the creator can delete this blog' });
  }

  await Blog.findByIdAndDelete(blogId);
  
  response.status(204).end();
});

blogerRouter.put('/:id', async (request, response) => {
  const body = request.body;


  const blog = {
    ...body,
    likes: body.likes,
  };

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  
  response.json(updateBlog.toJSON());
});


module.exports = blogerRouter 