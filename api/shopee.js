const fetch = require("node-fetch");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { link, limit } = req.body;
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwWLsg8UdIAdhqrIraG59ciaFNqSl2Rx0Fsnev08QpyA_QgRKSFhNPAB2Md4qZNp3yZ/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, limit })
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};