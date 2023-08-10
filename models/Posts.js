var db = require('../conf/database');
const PostModel = {};

PostModel.create = (title, description, video, thumbnail, fk_userId) => {
    let baseSQL = 'INSERT INTO posts (title, description, video, thumbnail, createAt, fk_userId) VALUE (?,?,?,?, now(),?);;';
    return db.execute(baseSQL,[title, description, video, thumbnail, fk_userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSQL = 
        "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ?;";
    let sqlReadySearchTerm = "%"+searchTerm+"%";
    return db.execute(baseSQL, [sqlReadySearchTerm])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getNRecentPosts = (numberOfPost) => {
    let baseSQL = "SELECT id, title, description, thumbnail, createAt FROM posts ORDER BY createAt DESC LIMIT 8";
    return db
        .query(baseSQL, [numberOfPost])
        .then(([results, fields]) => {
            return Promise.resolve(results)
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
    let baseSQL = 'SELECT u.username, p.title, p.description, p.video, p.createAt FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;';
    return db
        .execute(baseSQL,[postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
    })
    .catch(err => Promise.reject(err));
};

module.exports = PostModel;