const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../middleware/auth');
const { login } = require('../controllers/user-ctrl');

router.route('/').post(login);

router.get('/', ensureGuest, (req, res) => {
  try {
    res.render('main/login', {
      layout: 'login',
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
