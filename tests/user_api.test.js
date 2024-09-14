const { test ,describe} = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('testing login user', () => { 
    test('Test the username',async () => { 

        const user = {
            username:"mact",
            password:"12",
            name:"Ale"
        }   
       const response= await api.post('/api/users').send(user).expect(400)
       const errorMessage = response.body.error || response.text;
    assert.strictEqual(errorMessage, 'password should be at least 3 characters long');
       
 })
})