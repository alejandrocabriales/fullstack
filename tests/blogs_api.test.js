const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const api = supertest(app);


const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

const getToken = async () => {
  const user = await User.findOne({ username: 'mact200590' });
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return jwt.sign(userForToken, process.env.SECRET);
};

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('verify number of blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect('Content-Type', /application\/json/);
  assert.strictEqual(response.body.length, 2);
});

test('verify id', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  blogs.forEach((blog) => {
    assert.ok(blog.id);
  });
});

test('should add a new blog with token', async () => {
  const token = await getToken();

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Ale Blog',
      author: 'Some author',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 23,
    })
    .expect(201);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, 3);
});

test('should fail with 401 if token is not provided', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Unauthorized Blog',
      author: 'Some author',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    })
    .expect(401);
});

test('should set likes to 0 if likes not provided', async () => {
  const token = await getToken();

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Ale Blog ',
      author: 'Some author',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    })
    .expect(201);

  const newBlog = response.body;
  assert.strictEqual(newBlog.likes, 0);
});

test('should return 400 for blog without title', async () => {
  const token = await getToken();

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: '',
      author: 'Some author',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    })
    .expect(400);
});

test('should delete a blog', async () => {
  const token = await getToken();
  

  const valuesDataBase = (await api.get('/api/blogs')).body;
  
  const getValueToDelete = valuesDataBase[0].id;

  await api
    .delete(`/api/blogs/${getValueToDelete}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);
});


test('should update a blog', async () => {
  const valuesDataBase = (await api.get('/api/blogs')).body;
  const getValueToUpdate = valuesDataBase[1];

  await api
    .put(`/api/blogs/${getValueToUpdate.id}`)
    .send({
      ...getValueToUpdate,
      likes: 290,
    })
    .expect(200);
});

after(async () => {
  await mongoose.connection.close();
});
