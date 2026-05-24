const Code = require("../models/Code");

exports.saveCode = async (req, res) => {

  try {

    const {
      roomId,
      code,
      language,
      username,
    } = req.body;

    const savedCode =
      await Code.create({

        roomId,
        code,
        language,
        username,
      });

    res.status(201).json(savedCode);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Save failed",
    });
  }
};

exports.getHistory = async (
  req,
  res
) => {

  try {

    const history =
      await Code.find({
        roomId:
          req.params.roomId,
      });

    res.json(history);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "History fetch failed",
    });
  }
};