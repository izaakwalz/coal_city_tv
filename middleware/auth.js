module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/cc-login');
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.flash('info_msg', 'INFO: NOT SO FAST🙄, LOGOUT TO CONTINUE😤😤');
      res.redirect('/admin/dashboard');
    } else {
      return next();
    }
  },
};
