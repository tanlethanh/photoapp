const db = require('../conf/database');
// const { getPostById } = require('./Posts');
const CommentModel = {};

CommentModel.create = (userId, postId, text) => {
    const baseSQL = 'INSERT INTO comments (text, fk_postid, fk_userId) VALUES (?,?,?)';
    return db.query(baseSQL, [text, postId, userId])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

CommentModel.getCommentsForPost = (postId) => {
    const baseSQL = 'SELECT u.username, c.text, c.createAt, c.id FROM comments c JOIN users u on u.id=c.fk_userId WHERE c.fk_postid=? ORDER BY c.createAt DESC';
    return db.query(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        }).catch(err => Promise.reject(err));
};
CommentModel.deletePostComments = (postId) => {
    const baseSQL = 'DELETE FROM comments WHERE fk_postId = ?;';
    return db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
};

module.exports = CommentModel;
