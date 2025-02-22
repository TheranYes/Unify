const express = require('express');

const app = express();
const PORT = 5000;

function logger(req, res, next) {
  console.log(`Called: ${req.orginalUrl}`);
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});