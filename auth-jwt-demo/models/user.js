var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userName: String,
    password: String
  });
  module.exports = mongoose.model('usermodel', UserSchema );