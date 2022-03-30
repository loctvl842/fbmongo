const User = require('../models/Users');
const router = require('express').Router();
const bcrypt = require('bcrypt');

// update a user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // update password have to generate a new code
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch {
        (error) => {
          return res.status(500).json(error);
        };
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated <3 <3');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json('You can update your account only!!! >.<');
  }
});
// delete a user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted <3 <3');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json('You can delete your account only!!! >.<');
  }
});

// get a a user
// [GET] /api/users?userId=..,username=..
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// follow a user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json('User has been followed');
      } else {
        res.status(403).json('You already followed this guy !!!');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});
// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json(`You stop following user id: ${req.params.id}`);
      } else {
        res.status(403).json("You haven't followed this guy !!!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

// search user
// [GET] /api/users/search
router.get('/search/:searchText', async (req, res) => {
  const searchText = JSON.parse(req.params.searchText);
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

    const searchTextRegex = stringToVNmeseRegex(searchText);
    const searchedUsers = await User.find({
      username: {
        $regex: `.*${searchTextRegex}.*`,
        $options: 'i',
      },
    });
    res.status(200).json(searchedUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
