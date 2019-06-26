const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: String,
  subreddit: String,
  title: String,
  body: String,
  time: {
    type: Date,
    default: Date.now()
  },
  type: String,
  link: String,
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  neutralvotes: {
    type: Number,
    default: 0
  },
  num_of_comments: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Post', postSchema);
