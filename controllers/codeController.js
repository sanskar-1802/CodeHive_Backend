const axios = require("axios");

exports.executeCode = async (req, res) => {

  try {

    const {
      code,
      language,
    } = req.body;

    const response =
      await axios.post(

        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",

        {
          source_code: code,

          language_id: Number(language),
        },

        {
          headers: {

            "Content-Type":
              "application/json",

            "X-RapidAPI-Key":
              process.env.RAPIDAPI_KEY,

            "X-RapidAPI-Host":
              "judge0-ce.p.rapidapi.com",
          },
        }
      );

    return res.json({

      stdout:
        response.data.stdout,

      stderr:
        response.data.stderr,

      compile_output:
        response.data.compile_output,
    });

  } catch (err) {

    console.log(
      "Code Execute Error:",
      err.response?.data || err
    );

    return res.status(500).json({

      message:
        "Code execution failed",
    });
  }
};