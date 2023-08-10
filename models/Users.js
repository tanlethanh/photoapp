const db = require('../conf/database');
const UserModel = {};
const bcrypt = require('bcrypt');

UserModel.create = (username, password, email) => {
    return bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const baseSQL = 'INSERT INTO users(`username`,`email`,`password`,`createdAt`) VALUES (?,?,?,now());';
            return db.execute(baseSQL, [username, email, hashedPassword]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

UserModel.usernameExists = (username) => {
    return db.execute('SELECT * FROM users WHERE username=?', [username])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
};

UserModel.getUserById = (userId) => {
    const baseSQL = 'SELECT username, email, createdAt FROM users WHERE id=?;';
    return db
        .execute(baseSQL, [userId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
};

UserModel.emailExists = (email) => {
    return db.execute('SELECT * FROM users WHERE email=?', [email])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
};

UserModel.aunthenticate = (username, password) => {
    let userId;
    const baseSQL = 'SELECT id, username, password FROM users WHERE username=?;';
    return db
        .execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                userId = results[0].id;
                return bcrypt.compare(password, results[0].password);
            } else {
                return Promise.reject(new Error('Something went wrong'));
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) {
                return Promise.resolve(userId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

module.exports = UserModel;
