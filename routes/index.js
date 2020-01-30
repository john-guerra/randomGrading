var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dbName = "lottery";

function setGrade(grade, cbk) {
  const url = "mongodb://localhost:27017";

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    const timestamp = new Date();
    const date = timestamp.toDateString();
    grades.update(
      {
        name: grade.name,
        date: date
      },
      {
        date: date,
        timestamp: timestamp,
        name: grade.name,
        grade: grade.grade
      },
      { upsert: true },
      function(res) {
        console.log("Mongo successfully updated", res);
        cbk.apply(this, arguments);
        client.close();
      }
    );
  });
}

function getGrades(cbk) {
  const url = "mongodb://localhost:27017";

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    const timestamp = new Date();
    const date = timestamp.toDateString();
    grades
      .find({
        date: date
      })
      .toArray((err, grades) => {
        console.log("got grades", grades);

        if (err) {
          cbk(err);
          return;
        }
        cbk(grades);
      });
  });
}

/* GET home page. */
router.post("/setGrade", function(req, res) {
  console.log("setGrade");
  console.log("body", req.body);

  setGrade(req.body, () => {
    console.log("done!");
    res.json({ inserted: true });
  });
});

/* GET home page. */
router.get("/getGrades", function(req, res) {
  console.log("getGrades");
  console.log("body", req.body);

  getGrades(grades => {
    console.log("done!");
    res.json(grades);
  });
});

module.exports = router;
