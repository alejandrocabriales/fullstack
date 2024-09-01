const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const { title } = require('node:process')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7, 
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5, 
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('verify number of blogs are returned', async ()=> {
  const response= await api.get('/api/blogs').expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length,2)
})

test('verify id', async ()=> {
  const response = await api.get('/api/blogs')
    
  const blogs=response.body
  blogs.forEach(blog => {
    assert.ok(blog.id)
  });
})

test('should add a new blog', async() => { 
  await api.post('/api/blogs').send({
    title: 'Ale Blog',
    author: 'Some author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 23
  })
  const response= await api.get('/api/blogs')
  .expect(200)
  assert.strictEqual(response.body.length,3)
 })


 test('Blog List Tests, step 4', async() => { 
  const response = await api.post('/api/blogs').send({
    title: 'Ale Blog ',
    author: 'Some author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }).expect(201)


   const newBlog = response.body
  

  assert.strictEqual(newBlog.likes, 0)
 })


 test(' Blog List tests, step 5', async() => { 
  const response = await api.post('/api/blogs').send({
    title:'',
    author: 'Some author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }).expect(400)
 })

 test('4.13 Blog List Expansions, step 1: delete', async() => { 
const valuesDataBase= (await api.get('/api/blogs')).body
  const getValueToDelete = valuesDataBase[0].id
 await api.delete(`/api/blogs/${getValueToDelete}`).expect(204)

 })

 test('Blog List Expansions, step 2 Update', async() => { 
  const valuesDataBase= (await api.get('/api/blogs')).body
  console.log('getValueToDelete',valuesDataBase)
  const getValueToUpdate = valuesDataBase[1]

  await api.put(`/api/blogs/${getValueToUpdate.id}`).send({
    ...getValueToUpdate,
    likes:290
  }).expect(200)
 })




after(async () => {
  await mongoose.connection.close()
})