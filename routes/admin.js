const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const { uploadPhoto2, deleteImage } = require('../controllers/upload-ctrl');
const {
  dashboard,
  user,
  adduser,
  createUser,
  editUser,
  logout,
  updateUser,
} = require('../controllers/user-ctrl');
const {
  getPost,
  getPostForm,
  addPost,
  editPost,
  updatePost,
  deletePost,
  addCategory,
  getCategory,
  editCategory,
  updateCategory,
  deleteCategory,
  getUpload,
} = require('../controllers/post-ctrl');

router.route('/dashboard').get(ensureAuth, dashboard);
router.route('/user').get(ensureAuth, user);
router.route('/user/add').get(ensureAuth, adduser).post(ensureAuth, createUser);
router
  .route('/user/edit/:id')
  .get(ensureAuth, editUser)
  .put(ensureAuth, updateUser);

// get post
router.route('/posts').get(ensureAuth, getPost);
// add post
router
  .route('/posts/add')
  .get(ensureAuth, getPostForm)
  .post(ensureAuth, addPost);
// update posts
router
  .route('/posts/edit/:id')
  .get(ensureAuth, editPost)
  .put(ensureAuth, updatePost);
router.route('/posts/delete/:id').delete(ensureAuth, deletePost);
// add category
router
  .route('/category')
  .get(ensureAuth, getCategory)
  .post(ensureAuth, addCategory);
router
  .route('/category/:id')
  .get(ensureAuth, editCategory)
  .put(ensureAuth, updateCategory)
  .delete(ensureAuth, deleteCategory);

router
  .route('/images')
  .get(ensureAuth, getUpload)
  .post(ensureAuth, uploadPhoto2);

// router.route('/images/upload').post(uploadPhoto2);
router.route('/images/delete/:id').delete(ensureAuth, deleteImage);

router.route('/logout').get(ensureAuth, logout);

module.exports = router;
