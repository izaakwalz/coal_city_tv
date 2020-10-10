const User = require('../models/User');
const Image = require('../models/Image');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.dashboard = (req, res) => {
  res.render('admin/index', {
    layout: 'admin',
    username: req.user.username,
    ID: req.user.userID,
  });
};

exports.user = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).lean();
    res.render('admin/user/index', {
      layout: 'admin',
      user: user,
      username: req.user.username,
      ID: req.user.userID,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
};

exports.adduser = (req, res) => {
  res.render('admin/user/signup', {
    layout: 'admin',
    username: req.user.username,
    ID: req.user.userID,
  });
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, password2 } = req.body;
    //   Check requried fields
    if (!firstName || !lastName || !email || !password || !password2) {
      req.flash('warning_msg', 'Please fill in all fields');
      res.redirect('/admin/user/add');
    } else if (password !== password2) {
      // check password match
      req.flash('warning_msg', 'WARNING: password do not match');
      res.redirect('/admin/user/add');
    } else if (password.length < 6) {
      // password check length
      req.flash('warning_msg', 'password should be at least 6 characters long');
      res.redirect('/admin/user/add');
    } else {
      const user = await User.findOne({ email: email }).lean();
      if (user) {
        // user exist
        req.flash('error_msg', 'user allready registered');
        res.redirect('/admin/user/add');
      } else {
        // hashPassword
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = {
          userID: `#${Math.round(Math.random(5) * 1e9)}`,
          firstName,
          lastName,
          email,
          password: hashPassword,
        };
        await User.create(newUser);
        req.flash('success_msg', 'You are now registered and can login');
        res.redirect('/cc-login');
      }
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).lean();
    const images = await Image.find().lean();
    if (!user) {
      req.flash('error_msg', 'ERROR: cannot find post with that ID');
      res.redirect('/admin/user');
    } else {
      res.render('admin/user/edit', {
        layout: 'admin',
        username: req.user.username,
        ID: req.user.userID,
        user: user,
        images: images,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
};

// Login Handle
exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/cc-login',
    failureFlash: true,
  })(req, res, next);
};

// Logout handle
exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'SUCCESSFULL: Want to Login? 😃 ');
  res.redirect('/cc-login');
};

exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      avatar,
      background,
      bio,
      phone,
      address,
      password,
      password2,
    } = req.body;
    if (
      !firstName ||
      !email ||
      !lastName ||
      !username ||
      !avatar ||
      !background ||
      !bio ||
      !phone ||
      !address ||
      !password ||
      !password2
    ) {
      req.flash('warning_msg', 'Please fill in all fields');
      res.redirect(`/admin/user/edit/${req.user._id}`);
    } else if (password !== password2) {
      // check password match
      req.flash('warning_msg', 'WARNING: password do not match');
      res.redirect(`/admin/user/edit/${req.user._id}`);
    } else if (password.length < 6) {
      // password check length
      req.flash(
        'warning_msg',
        'WARNING: password should be at least 6 characters long'
      );
      res.redirect(`/admin/user/edit/${req.user._id}`);
    } else {
      let user = await User.findById(req.params.id).lean();
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          email,
          firstName,
          lastName,
          username,
          email,
          bio,
          password: hashPassword,
          avatar,
          background,
          phone,
          address,
        },
        {
          new: true,
          runValidators: false,
        }
      );
      req.flash('success_msg', 'SUCCESS: Account Updated Successfully');
      res.redirect('/admin/user');
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
};
