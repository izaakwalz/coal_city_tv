const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
