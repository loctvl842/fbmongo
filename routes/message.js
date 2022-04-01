const Message = require('../models/Message');
const router = require('express').Router();

// [POST] /api/messages
router.post('/', async (req, res) => {
  try {
    const newMessage = new Message({
      content: req.body.content,
      sender: req.body.sender,
      room: req.body.room,
      file: req.body.file,
    });
    await newMessage.save();
    res.status(200).json('New message saved successfully');
  } catch (err) {
    res.status(500).json(err);
  }
});

// [GET] /api/messages?roomId=...
router.get('/', async (req, res) => {
  try {
    const roomId = req.query.roomId;
    const messages = await Message.find({ room: roomId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
