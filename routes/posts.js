var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError')
var PostModel = require('../models/Posts')
const { body, validationResult } = require('express-validator');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "uploadImage") {
            cb(null, "public/images/uploads");
        } else if (file.fieldname === "uploadVideo") {
            cb(null, "public/videos/uploads");
        } else {
            cb(new Error("Invalid fieldname"));
        }
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});


var uploader = multer({ storage: storage });

router.post("/createPost", [body('title').isLength({ min: 0 }), body('description').isLength({ min: 0 })], uploader.fields([
    { name: 'uploadImage', maxCount: 1 },
    { name: 'uploadVideo', maxCount: 1 }
]), (req, res, next) => {

    let fileUploaded = req.files["uploadVideo"][0].path;
    let fileAsThumbnail = `thumbnail-${req.files["uploadImage"][0].filename}`;
    let destinationOfThumbnail = req.files["uploadImage"][0].destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        req.flash('error', 'Post could not be made');
        res.redirect('/');
        return res.status(400).json({ errors: errors.array() });
    }

    sharp(req.files["uploadImage"][0].path)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(
                title,
                description,
                fileUploaded,
                destinationOfThumbnail,
                fk_userId,
            );
        })
        .then((postWasCreated) => {
            if (postWasCreated) {
                req.flash('success', "Post was created successfully");
                res.redirect('/');
            } else {
                throw new PostError('Posts could not be created', 'postimage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })
});

router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                message: "no search term given",
                results: [],
            });
        } else {
            let results = await PostModel.search(searchTerm);
            if (results && results.length) {
                res.send({
                    message: `${results.length} results found`,
                    results: results
                });
            } else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "no results were your search were found. showing 8 most recent posts",
                    results: results,
                });
            }
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
