const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/Users');
const { unlinkSync } = require('fs');
const path = require('path');

// create a post
router.post('/', async (req, res) => {
  console.log('req.body: ', req.body);
  const newPost = new Post(req.body);
  newPost.userId = req.body.userId;
  console.log('newPost: ', newPost);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
// update a post (passing the postId as param)
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('The post is updated successfully <3 <3');
    } else {
      res.status(403).json('You are only able to change your post !!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json(post);
    } else {
      res.status(403).json('You are only able to delete your post !!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// like | dislike a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      console.log('You liked a post');
      res.status(200).json('You liked a post');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      console.log('You disliked a post');
      res.status(200).json('You disliked a post');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get timeline posts
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

// get user's all posts
router.get('/profile/:username', async (req, res) => {
  try {
    const currentUser = await User.findOne({
      username: req.params.username,
    });
    console.log('currentUser', currentUser);
    const posts = await Post.find({ userId: currentUser._id });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all posts in database [should never use]
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get the number of posts in database
router.get('/count/all', async (req, res) => {
  try {
    const numPost = await Post.countDocuments();
    res.status(200).json(numPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// [GET] get n random posts in database
// api/posts/random/6
router.get('/random/:num', async (req, res) => {
  try {
    const randomPosts = await Post.aggregate().sample(parseInt(req.params.num));
    res.status(200).json(randomPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
