const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  todos: [{type: String}]
});

module.exports = mongoose.model('Users', usersSchema);