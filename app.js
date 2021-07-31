"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
var MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const router = express.Router();
router.get("/", (req, res) => {
  console.log(__dirname);
  MongoClient.connect(
    "mongodb+srv://diode:diode321@cluster0.a7ftq.mongodb.net/?retryWrites=true&useUnifiedTopology=true&w=majority",
    function (err, client) {
      var db = client.db("file_db");
      if (err) {
        console.log("Please check you db connection parameters");
        res.render("index", { title: "Some Error" });
      } else {
        var collection = db.collection("files");
        collection.findOne({}, function (err, documents) {
          if (err) return console.error(err);
          fs.writeFile(
            "./public/fast.xml",
            documents.file_data.buffer,
            function (err) {
              if (err) {
                console.log(err);
                res.render("index", { title: "Some Error" });
              }
              console.log("Sucessfully saved!");
              client.close();
              res.sendFile(path.join(__dirname, "./public", "fast.xml"));
            }
          );
        });
      }
    }
  );
});
router.get("/fast", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "fast.xml"));
});

app.use("/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

app.listen(3000, () => console.log('Local app listening on port 3000!'));

module.exports = app;
module.exports.handler = serverless(app);
