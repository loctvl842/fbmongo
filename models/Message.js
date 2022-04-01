const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Messages', MessageSchema);
