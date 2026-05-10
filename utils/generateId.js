const { nanoid } = require("nanoid");

exports.generateRoomId = () => nanoid(8);