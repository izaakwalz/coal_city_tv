const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'title is required'],
    },
    link: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'post content is required'],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image',
      required: [true, 'image is required'],
    },
    status: {
      type: String,
      default: 'public',
      enum: ['public', 'private'],
      required: [true, 'status is required'],
    },
    trending: {
      type: String,
      default: 'recent',
      enum: ['recent', 'popular'],
      required: [true, 'trending is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'category is required'],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    meta: {
      type: String,
    },
    keywords: {
      type: String,
    },
    allowComments: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
