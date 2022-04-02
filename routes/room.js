const Room = require('../models/Room');
const User = require('../models/Users');
const router = require('express').Router();

const hasDuplicate = (arr) => {
  let n = arr.length;
  console.log(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[i].userId === arr[j].userId) {
        return true;
      }
    }
  }
  return false;
};

// [POST] /api/rooms
router.post(`/`, async (req, res) => {
  try {
    const newRoom = new Room({
      members: req.body.members,
      name: req.body.roomname,
    });
    if (hasDuplicate(newRoom.members)) {
      res.status(404).json("Room can't have duplicate member !!");
      return;
    }
    await newRoom.save();
    res.status(200).json('Create new room successfully <3');
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
});

// fetch 3 last updated room
// pass id of current user
// [GET] /api/rooms?userId=...
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.query.userId;
    const currentUser = await User.findById(currentUserId);
    const currentMember = {
      userId: currentUser._id,
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
    };
    const rooms = await Room.find({ $in: currentMember })
      .sort({
        updatedAt: -1,
      })
      .limit(10);
    rooms.forEach((room) => {
      room.members = room.members.filter(
        (member) => member.userId !== currentUserId,
      );
      if (room.members.length == 1) {
        room.name = room.members[0].username;
        room.img = [room.members[0].profilePicture];
      } else {
        const renderName = () => {
          let name = currentMember.username;
          room.members.forEach((member) => {
            name += ',' + member.username;
          });
          return name;
        };
        room.roomId = room._id;
        if (!room.name) {
          room.name = renderName();
        }

        if (!room.img.length) {
          room.img = [
            room.members[0].profilePicture,
            room.members[1].profilePicture,
          ];
        }
      }
    });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
