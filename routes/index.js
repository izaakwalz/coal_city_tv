const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const post = await Post.findOne({ status: 'public' })
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();

    const category = await Category.find().lean();
    const posts = await Post.find({
      status: 'public',
      category: category,
    })
      .limit(3)
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();
    const recent = await Post.find({ status: 'public', trending: 'recent' })
      .limit(3)
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();
    const popular = await Post.find({ status: 'public', trending: 'popular' })
      .limit(3)
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();

    const trends = await Post.findOne({ status: 'public', trending: 'popular' })
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();

    res.render('main/home', {
      layout: 'main',
      post: post,
      posts: posts,
      recent: recent,
      popular: popular,
      categories: category,
      trend: trends,
    });
  } catch (error) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'public' })
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();
    res.render('main/posts', {
      layout: 'main',
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    res.render('error/400', {
      layout: 'error',
    });
  }
});

router.get('/posts/:title', async (req, res) => {
  try {
    const link = req.params.title;
    const post = await Post.findOne({ link })
      .populate('image')
      .populate('category')
      .lean();
    if (!post) {
      res.render('error/404', {
        layout: 'error',
      });
    } else {
      res.render('main/singlepost', {
        layout: 'main',
        post: post,
      });
    }
  } catch (err) {
    console.log(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
});

router.get('/category', async (req, res) => {
  try {
    const name = req.query.name;
    const posts = await Post.find({ category: name, status: 'public' })
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('category')
      .lean();
    if (!posts) {
      res.render('error/404', {
        layout: 'error',
      });
    } else {
      res.render('main/category', {
        layout: 'main',
        category: posts,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', { layout: 'error' });
  }
});

module.exports = router;
