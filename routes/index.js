var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dbName = "lottery";

function deleteGrade(grade, cbk) {
  const url = "mongodb://localhost:27017";

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    // Convert the timestamp to date

    grade.timestamp =
      grade.timestamp !== undefined ? new Date(grade.timestamp) : undefined;

    const timestamp = new Date();
    const date = timestamp.toDateString();

    // If grade.timestamp exists we are updating
    grades.deleteOne(
      {
        name: grade.name,
        date: date,
        timestamp: grade.timestamp
      },
      function(err, res) {
        if (err) {
          console.log("error deleting");
        } else {
          console.log("Mongo successfully deleted", res.deletedCount);
          if (res.deletedCount) {
            cbk.apply(this, arguments);
          }
        }
        client.close();
      }
    );
  });
}

function setGrade(grade, cbk) {
  const url = "mongodb://localhost:27017";

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    // Convert the timestamp to date

    grade.timestamp =
      grade.timestamp !== undefined ? new Date(grade.timestamp) : undefined;

    const timestamp = new Date();
    const date = timestamp.toDateString();

    // If grade.timestamp exists we are updating
    grades.update(
      {
        name: grade.name,
        date: date,
        timestamp: grade.timestamp
      },
      {
        date: date,
        timestamp: grade.timestamp || timestamp,
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
      .sort({ timestamp: -1 })
      .toArray((err, grades) => {
        console.log("got grades", grades.length);
        if (err) {
          cbk(err);
          return;
        }
        cbk(grades);
      });
  });
}

router.post("/setGrade", function(req, res) {
  console.log("***setGrade", req.ip);

  if (req.ip !== "127.0.0.1") {
    console.log("Request not from localhost ", req.ip, " ignoring");
    return;
  }

  setGrade(req.body, () => {
    console.log("done!");
    res.json({ inserted: true });
  });
});

router.post("/delete", function(req, res) {
  console.log("*** delete", req.ip);

  if (req.ip !== "127.0.0.1") {
    console.log("Request not from localhost ", req.ip, " ignoring");
  }

  deleteGrade(req.body, () => {
    console.log("Deleted!");
    res.json({ deleted: true });
  });
});

router.get("/getGrades", function(req, res) {
  console.log("getGrades");
  console.log("body", req.body);

  getGrades(grades => {
    console.log("Got grades!");
    res.json(grades);
  });
});

module.exports = router;
