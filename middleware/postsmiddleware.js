const { getNRecentPosts, getPostById } = require('../models/Posts');
const { getCommentsForPost } = require('../models/Comments');
const postMiddleware = {};

postMiddleware.getNRecentPosts = async function (req, res, next) {
    try {
        const results = await getNRecentPosts(8);
        res.locals.results = results;
        if (results.length == 0) {
            req.flash('error', 'There are no post created yet');
        }
        next();
    } catch (err) {
        next(err);
    }
};

postMiddleware.getPostById = async function (req, res, next) {
    try {
        const postId = req.params.id;
        const results = await getPostById(postId);
        if (results && results.length) {
            res.locals.currentPost = results[0];
            next();
        } else {
            req.flash('error', 'This is not the post you are looking for.');
            res.redirect('/');
        }
    } catch (error) {
        next(err);
    }
};

postMiddleware.getCommentsByPostId = async function (req, res, next) {
    const postId = req.params.id;
    try {
        const results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = postMiddleware;
