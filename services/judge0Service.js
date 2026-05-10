const axios = require("axios");

exports.executeCode = async (code, language_id) => {
  const res = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions",
    {
      source_code: code,
      language_id,
    },
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const token = res.data.token;

  // Polling
  let result;
  while (true) {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    if (response.data.status.id >= 3) {
      result = response.data;
      break;
    }
  }

  return result;
};