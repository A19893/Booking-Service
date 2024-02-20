const express = require("express");
const { APP_PORT } = require("./config/serverConfig");
const app = express();

const setupAndStartSerer = () => {
  app.use(express.json({ limit: "50mb", extended: true }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use('/api', require('./routes'))
  app.listen(APP_PORT, function () {
    console.clear();
    console.log(`Server is listening on port ${APP_PORT}`);
  });
};

setupAndStartSerer();
