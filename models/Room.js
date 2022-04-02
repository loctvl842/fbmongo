const mongoose = require('mongoose');
const arrayValidator = require('mongoose-array-validator');

const RoomSchema = new mongoose.Schema(
  {
    members: [
      {
        userId: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        profilePicture: {
          type: String,
          required: true,
        },
      },
    ],
    name: {
      type: String,
    },
    img: {
      type: [String],
    },
  },
  { timestamps: true },
);

RoomSchema.plugin(arrayValidator);

module.exports = mongoose.model('Rooms', RoomSchema);
