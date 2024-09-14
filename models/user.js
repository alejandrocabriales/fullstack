const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    
    username: {
      type: String,
      unique: true,
      minLength: 3 
    },
    passwordHash: {
      type: String,
      required: true
    },
    blog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ]
  })
  userSchema.set('toJSON', {

    transform: (document, returnedObject) => {

      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  const User = mongoose.model('User', userSchema)

  module.exports = User