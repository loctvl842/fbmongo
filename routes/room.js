const Room = require('../models/Room');
const User = require('../models/Users');
const router = require('express').Router();

// redis
const REDIS_PORT = process.env.PORT || 6379;
const Redis = require('redis');
const redisClient = Redis.createClient(REDIS_PORT);
const DEFAULT_EXPIRATION = 3600;

const hasDuplicate = (arr) => {
  let n = arr.length;
  console.log(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[i]._id === arr[j]._id) {
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

redisClient.on('error', (err) => {
  console.log('error: ' + err);
});

// pass id of current user
// [GET] /api/rooms?userId=...
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.query.userId;
    const currentUser = await User.findById(currentUserId);
    const currentMember = {
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      _id: currentUser._id,
    };
    console.log(currentMember);
    console.log(currentMember);
    const rooms = await Room.find({
      members: {
        $in: [currentMember],
      },
    })
      .sort({
        updatedAt: -1,
      })
      .limit(10);
    rooms.forEach((room) => {
      room.members = room.members.filter(
        (member) => member._id.toString() !== currentUserId,
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
    return res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
});

// [GET] /api/rooms/search?userId=...&searchText=..
router.get('/search', async (req, res) => {
  const searchText = req.query.searchText;
  if (!searchText) {
    res.status(200).json([]);
    return;
  }
  try {
    function stringToVNmeseRegex(str) {
      str = str.toLowerCase();
      str = str.replace('a', '[aàáãạảăắằẳẵặâấầẩẫậa]');
      str = str.replace('e', '[eèéẹẻẽêềếểễệ]');
      str = str.replace('d', '[dđ]');
      str = str.replace('i', '[iìíĩỉị]');
      str = str.replace('o', '[oòóõọỏôốồổỗộơớờởỡợ]');
      str = str.replace('u', '[uùúũụủưứừửữự]');
      str = str.replace('y', '[yỳỵỷỹý]');
      return str;
    }
    // regex text to search
    const searchTextRegexString = stringToVNmeseRegex(searchText);
    // fetch the room and update room with name
    const currentUserId = req.query.userId;
    const currentUser = await User.findById(currentUserId);
    const currentMember = {
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      _id: currentUser._id,
    };
    const rooms = await Room.find({
      members: {
        $in: [currentMember],
      },
    })
      .sort({
        updatedAt: -1,
      })
      .limit(10);
    rooms.forEach((room) => {
      room.members = room.members.filter(
        (member) => member._id.toString() !== currentUserId,
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

    const searchTextRegexExp = new RegExp(`.*${searchTextRegexString}.*`, 'i');
    const searchedRooms = rooms.filter((room) =>
      searchTextRegexExp.test(room.name),
    );
    console.log(rooms);
    res.status(200).json(searchedRooms);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
