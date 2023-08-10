var db = require("../conf/database");
const { getPostById } = require("./Posts");
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = 'INSERT INTO comments (text, fk_postid, fk_userId) VALUES (?,?,?)';
    return db.query(baseSQL, [comment, postId, userId])
    .then(([results, fields]) => {
        if(results && results.affectedRows){
            return Promise.resolve(results.insertId);
        }else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
};

CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = 'SELECT u.username, text, createAt, c.id FROM comments c JOIN users u on u.id=fk_userId WHERE c.fk_postid=? ORDER BY createAt DESC';
    return db.query(baseSQL, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    }).catch(err => Promise.reject(err));
};

module.exports = CommentModel;