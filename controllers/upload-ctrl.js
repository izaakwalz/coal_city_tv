const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

exports.uploadPhoto2 = async (req, res, next) => {
  try {
    if (!req.body.name) {
      req.flash('warning_msg', 'WARNING: one or more field is empty');
      res.redirect('/admin/images');
    } else {
      const image = await Image.findOne({ name: req.body.name });
      if (image) {
        req.flash(
          'info_msg',
          `INFO: Category name "${image.name}" already exist`
        );
        res.redirect('/admin/images');
      } else {
        const file = req.files.mFile;
        const fileName = `${
          req.body.name
        }-${new Date().getTime().toString()}-${path.extname(file.name)}`;
        const save_file_path = `public/uploads/${fileName}`;
        await file.mv(save_file_path);
        Image.create({
          name: req.body.name,
          photo: `/uploads/${fileName}`,
        });
        req.flash('success_msg', 'Awesome: Upload Successfull 🙃');
        res.redirect('/admin/images');
      }
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await Image.findById(id).lean();
    if (!image) {
      req.flash('error_msg', 'ERROR: cannot find image with that ID');
      res.redirect('/admin/posts');
    } else {
      const remove_path = `public${image.photo}`;
      fs.unlink(remove_path, async (err) => {
        if (err) {
          throw err;
        }
        await Image.deleteOne({ _id: id });
        req.flash('success_msg', 'SUCCESSFULL: Image Deleted 🤗🤗');
        res.redirect('/admin/images');
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

// new Date().getTime().toString() + path.extname(file.name)
