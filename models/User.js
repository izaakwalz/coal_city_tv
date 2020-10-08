const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: '/uploads/no-img.png',
    },
    background: {
      type: String,
      trim: true,
      default: '/uploads/bg.jpg',
    },
    bio: {
      type: String,
      trim: true,
      default: 'write about your self',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
