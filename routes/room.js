const Room = require('../models/Room');
const router = require('express').Router();

// [POST] /api/rooms
router.post(`/`, async (req, res) => {
  try {
    const newRoom = new Room({
      members: req.body.members,
      lastMessage: {
        senderId: req.body.lastMessage.senderId,
        content: req.body.lastMessage.content,
      },
      name: req.body.name,
    });
    await newRoom.save();
    res.status(200).json('Create new room successfully <3');
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
});

// pass id of current user
// [GET] /api/rooms?userId=...
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.query.userId;
    const rooms = await Room.find({
      members: { $in: [currentUserId] },
    });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
