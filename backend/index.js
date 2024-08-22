//dependencies
const express = require("express");

//config
const app = express();

const PORT = 3000;

//posts endpoint - request and response
app.get("/posts", (req, res) => {
  let posts = [
    {
      caption: "Summer vibes",
      location: "Tangier, Morocco",
    },
    {
      caption: "London Eye view",
      location: "Greater London, UK",
    },
  ];
  res.send(posts);
});

//listen line
// use npm start
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
