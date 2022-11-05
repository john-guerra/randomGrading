// Script for inserting 0s to all the students, so we can have all of them with some grade

import mongodb from "mongodb";
import assert from "assert";
// STUDENT LIST GOES INTO front/src/App.js
import { classes } from "./front/src/students.mjs";

const { MongoClient } = mongodb;

const url = "mongodb://localhost:27017";

const initDate = new Date(2022, 7, 13);

const client = new MongoClient(url);
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  for (let cl in classes) {
    console.log("initializing", cl);
    const grades = client.db(`lottery_${cl}`).collection("grades");
    for (let name of classes[cl]) {
      grades.insertOne(
        {
          name,
          date: initDate.toDateString(),
          grade: 0,
          timestamp: initDate,
        },
        (res) => console.log("Inserted ", name, res)
      );
    }
  }
});
