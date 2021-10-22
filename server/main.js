var express = require("express");
var app = express();
var http = require("http").Server(app);

console.warn("-------\nNODE SERVER START\n\n--------\n");

app.use("/public/", express.static(__dirname + "/../.build/"));
app.use("/library/", express.static(__dirname + "/../debug/node_modules/"));

app.use("/wads/", express.static(__dirname + "/"));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:9000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/debug/*", function (req, res) {
  res.sendFile(__dirname + "/debug.html");
});

app.get("/doom.wad", function (req, res) {
  res.sendFile(__dirname + "/DoomUltimate.wad");
});

http.listen(8080, function () {
  console.log("Example app listening on port 8080");
});
