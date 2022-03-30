const router = require('express').Router();
const s3config = require('../s3config');

router.post('/avatar-img', (req, res) => {
    const uploadSingle = s3config.uploadFile().single('tvl-avatar-img');
    uploadSingle(req, res, async (err) => {
        if (err) {
            res.status(400).json({ content: err.message });
            return;
        }
        console.log(req.file);
        res.status(200).json(req.file.location);
    });
});

router.post('/cover-img', (req, res) => {
    const uploadSingle = s3config.uploadFile().single('tvl-cover-img');
    uploadSingle(req, res, async (err) => {
        if (err) {
            res.status(400).json({ content: err.message });
            return;
        }
        console.log(req.file);
        res.status(200).json(req.file.location);
    });
});

router.post('/post-img', (req, res) => {
    console.log(req.body);
    const uploadSingle = s3config.uploadFile().single('tvl-post-img');
    uploadSingle(req, res, async (err) => {
        if (err) {
            res.status(400).json({ content: err.message });
            return;
        }
        console.log(req.file);
        res.status(200).json(req.file.location);
    });
});

module.exports = router;
