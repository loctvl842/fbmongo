const mongoose = require('mongoose');
const arrayValidator = require('mongoose-array-validator');

const RoomSchema = new mongoose.Schema({
  members: {
    type: [String],
    minItems: 2,
    required: true,
  },
  lastMessage: {
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
  },
  img: {
    type: String,
  },
});

RoomSchema.plugin(arrayValidator);

module.exports = mongoose.model('Rooms', RoomSchema);
