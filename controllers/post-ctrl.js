const Post = require('../models/Post');
const Image = require('../models/Image');
const Category = require('../models/Category');

// <----------   POST --------->
// @desc    Show get  post all posts
// @route   GET /post/
exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category')
      .populate('image')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('admin/post/index', {
      layout: 'admin',
      title: 'All posts',
      posts: posts,
      count: posts.length,
      username: req.user.username,
      ID: req.user.userID,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

// @desc    Show add post
// @route   GET /post/add
exports.getPostForm = async (req, res) => {
  try {
    const cate = await Category.find().sort({ createdAt: 'desc' }).lean();
    const images = await Image.find().sort({ createdAt: 'desc' }).lean();
    res.render('admin/post/add', {
      layout: 'admin',
      title: 'Add post',
      categories: cate,
      images: images,
      username: req.user.username,
      ID: req.user.userID,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

//  @desc add post
//  @route = /admin/post
exports.addPost = async (req, res) => {
  try {
    const { title, content, image, status, category, trending } = req.body;
    if (!title || !content || !image || !status || !trending || !category) {
      req.flash('warning_msg', 'WARNING: one or more field is empty.');
      res.redirect('/admin/posts/add');
    } else {
      const post = await Post.findOne({ title });
      if (post) {
        req.flash('info_msg', `INFO: the post title ${title} already exist`);
        res.redirect('/admin/posts/add');
      } else {
        const comments = req.body.allowComments ? true : false;
        let link = title;
        let i = 0,
          strLength = link.length;
        for (i; i < strLength; i++) {
          link = link.replace(' ', '-');
        }
        await Post.create({
          title,
          link: link,
          content,
          image,
          status,
          trending,
          category,
          allowComments: comments,
        });
        res.redirect('/admin/posts');
      }
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

// @desc    edit post form
// @route   GET /post/edit/id
exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).lean();
    const cate = await Category.find().sort({ createdAt: 'desc' }).lean();
    const images = await Image.find().sort({ createdAt: 'desc' }).lean();

    if (!post) {
      req.flash('error_msg', 'ERROR: cannot find post with that ID');
      res.redirect('/admin/posts/add');
    } else {
      res.render('admin/post/edit', {
        layout: 'admin',
        title: 'Edit Post',
        post: post,
        categories: cate,
        images: images,
        username: req.user.username,
        ID: req.user.userID,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean();
    const { title, content, image, status, category, trending } = req.body;
    if (!title || !content || !image || !status || !trending || !category) {
      req.flash('warning_msg', 'WARNING: one or more field is empty.');
      res.redirect('/admin/posts/add');
    } else {
      if (!post) {
        req.flash('error_msg', 'ERROR: cannot find post with that ID');
        res.redirect('/admin/posts');
      } else {
        const comments = req.body.allowComments ? true : false;
        let link = title;
        let i = 0,
          strLength = link.length;
        for (i; i < strLength; i++) {
          link = link.replace(' ', '-');
        }
        post = await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            title,
            link: link,
            content,
            image,
            status,
            trending,
            category,
            allowComments: comments,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.redirect('/admin/posts');
      }
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.remove({ _id: req.params.id });
    req.flash('success_msg', `SUCCESSFULL: Post Deleted`);
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    return res.render('error/500', {
      layout: 'admin',
    });
  }
};

//  <---------   CATEGORY CTRL ----------------->

exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.render('admin/category/index', {
      layout: 'admin',
      categories: categories,
      count: categories.length,
      username: req.user.username,
      ID: req.user.userID,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      req.flash('warning_msg', 'WARNING: The category field is empty.');
      res.redirect('/admin/category');
    } else {
      const category = await Category.findOne({ name: req.body.name });
      if (category) {
        req.flash(
          'info_msg',
          `INFO: the category name "${req.body.name}" already exist`
        );
        res.redirect('/admin/category');
      } else {
        await Category.create(req.body);
        res.redirect('/admin/category');
      }
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const cate = await Category.findById(id).lean();
    const categories = await Category.find().lean();
    if (!cate) {
      req.flash('error_msg', 'ERROR:  cannot find category with that ID');
      res.redirect('/admin/category');
    } else {
      res.render('admin/category/edit', {
        layout: 'admin',
        category: cate,
        categories: categories,
        count: categories.length,
        username: req.user.username,
        ID: req.user.userID,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let cate = await Category.findById(req.params.id).lean();
    if (!req.body.name) {
      req.flash('warning_msg', 'WARNING: The category field is empty.');
      res.redirect('/admin/category');
    } else {
      const category = await Category.findOne({ name: req.body.name });
      if (category) {
        req.flash(
          'info_msg',
          `INFO: the category name "${req.body.name}" already exist`
        );
        res.redirect('/admin/category');
      } else {
        if (!cate) {
          req.flash('error_msg', 'ERROR:  cannot find category with that ID');
          res.redirect('/admin/category');
        } else {
          cate = await Category.findOneAndUpdate(
            { _id: req.params.id },
            { name: req.body.name },
            {
              new: true,
              runValidators: true,
            }
          );
          res.redirect('/admin/category');
        }
      }
    }
  } catch (error) {
    console.error(err);
    return res.render('error/500', {
      layout: 'admin',
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.remove({ _id: req.params.id });
    req.flash('success_msg', `SUCCESSFULL: Category Deleted`);
    res.redirect('/admin/category');
  } catch (err) {
    console.error(err);
    return res.render('error/500', {
      layout: 'admin',
    });
  }
};

//  <-------- UPLOAD -------------->
// @desc get upload form
exports.getUpload = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: 'desc' }).lean();
    res.render('admin/upload/index', {
      layout: 'admin',
      images: images,
      count: images.length,
      username: req.user.username,
      ID: req.user.userID,
    });
  } catch (err) {
    console.error(err);
    return res.render('error/500', {
      layout: 'admin',
    });
  }
};
