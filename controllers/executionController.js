const { executeCode } = require("../services/judge0Service");

exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const result = await executeCode(code, language);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};