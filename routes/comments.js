const express = require('express');
const router = express.Router();
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const { create } = require('../models/Comments');

router.post('/create', (req, res, next) => {
    const postId = req.session.postId;

    if (!req.session.username) {
        req.flash('error', 'Comment could not be made. Must be logged in to comment');
        res.redirect('/post/' + postId);
    } else {
        const { comment } = req.body;
        const username = req.session.username;
        const userId = req.session.userId;
        const postId = req.session.postId;

        create(userId, postId, comment)
            .then((wasSuccessful) => {
                if (wasSuccessful !== -1) {
                    successPrint(`Comment was created for ${username}`);
                } else {
                    errorPrint('Comment was not saved');
                }
                res.redirect('/post/' + postId);
            }).catch((err) => next(err));
    }
});

module.exports = router;
