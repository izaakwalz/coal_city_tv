const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'name is required'],
    },
    photo: {
      type: String,
      trim: true,
      required: [true, 'image is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;
