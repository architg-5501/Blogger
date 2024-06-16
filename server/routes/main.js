const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    const perPage = 6;
    const page = req.query.page || 1;
    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    const data = await Post.find()
      .sort({ createdAt: -1 })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .exec();

    res.render('index', {
      locals,
      data,
      currentPage: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });
  } catch (error) {
    console.log(error);
  }
});


router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    res.render('post', { locals, data, currentRoute: `/post/${slug}` });
  } catch (error) {
    console.log(error);
  }
});


router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Search',
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    });

    res.render('search', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

router.get('/about', (req, res) => {
  res.render('about', { currentRoute: '/about' });
});

module.exports = router;


