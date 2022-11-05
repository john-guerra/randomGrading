const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = process.env.MONGO_URL || "mongodb://localhost:27017";

export function deleteGrade(grade, cbk) {
  dbName = "lottery_" + grade.course;

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
        timestamp: grade.timestamp,
        course: grade.course,
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

export function setGrade(grade, cbk) {
  dbName = "lottery_" + grade.course;

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
        timestamp: grade.timestamp,
        course: grade.course,
      },
      {
        date: date,
        timestamp: grade.timestamp || timestamp,
        name: grade.name,
        grade: grade.grade,
        course: grade.course,
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

export function getGrades(course, cbk) {
  dbName = "lottery_" + course;

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    const timestamp = new Date();
    const date = timestamp.toDateString();
    grades
      .find({
        date: date,
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

export function getAllGrades(course, cbk) {
  dbName = "lottery_" + course;

  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const grades = client.db(dbName).collection("grades");

    grades
      .find({})
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
