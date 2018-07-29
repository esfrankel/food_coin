const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstlast: { type: String, required: true },
  paid: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
