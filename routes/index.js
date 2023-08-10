const express = require('express');
const router = express.Router();
const isLoggedin = require('../middleware/routesprotector').userIsLoggedIn;
const { getNRecentPosts, getPostById, getCommentsByPostId } = require('../middleware/postsmiddleware');
const { getUserById } = require('../models/Users');
const { getPostByUserId, deletePost } = require('../models/Posts');
const { deletePostComments } = require('../models/Comments');

// const db = require('../conf/database');

router.get('/', getNRecentPosts, function (req, res, next) {
    res.render('index', { title: "Truman's Page" });
});

router.get('/login', (req, res, next) => {
    res.render('login', { title: 'Login' });
});

router.get('/registration', (req, res, next) => {
    res.render('registration', { title: 'Registration' });
});

router.use('postImage', isLoggedin);
router.get('/postimage', (req, res, next) => {
    res.render('postimage', { title: 'Post Image' });
});
router.get('/profile', async (req, res, next) => {
    const userId = req.session.userId;
    const viewUser = await getUserById(userId);
    const results = await getPostByUserId(userId);
    res.render('profile', {
        title: 'User Profile',
        user: viewUser[0],
        posts: results
    });
});

// post/id
router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
    req.session.postId = req.params.id;
    let flag = false;
    if (res.locals.currentPost.username === req.session.username) {
        flag = true;
    }
    res.render('imagepost', { title: `Post ${req.params.id}`, post: res.locals.currentPost, check: flag });
});

router.get('/delete/:id(\\d+)', async (req, res, next) => {
    const postId = req.params.id;
    await deletePostComments(postId);
    await deletePost(postId);
    res.redirect('/');
});

module.exports = router;
