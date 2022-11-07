var express = require("express");
var router = express.Router();

const myDB = require("../db/myDB.js");

// const dbName = "lottery_web";
// const dbName = "lottery_web_spring2021";
// const dbName = "lottery_infovis_spring2021";
let dbName = "lottery_web_fall2022";

// STUDENT LIST GOES INTO front/src/students.mjs

router.post("/setGrade", function(req, res) {
  console.log("***setGrade", req.ip, req.body);

  if (req.ip !== "127.0.0.1") {
    console.log("Request not from localhost ", req.ip, " ignoring");
    return;
  }

  myDB.setGrade(req.body, () => {
    console.log("done!");
    res.json({ inserted: true });
  });
});

router.post("/delete", function(req, res) {
  console.log("*** delete", req.ip);

  if (req.ip !== "127.0.0.1") {
    console.log("Request not from localhost ", req.ip, " ignoring");
  }

  myDB.deleteGrade(req.body, () => {
    console.log("Deleted!");
    res.json({ deleted: true });
  });
});

router.get("/getGrades/:course", function(req, res) {
  console.log("getGrades");

  myDB.getGrades(req.params.course, (grades) => {
    console.log("Got grades!");
    res.json(grades);
  });
});

router.get("/getAllGrades/:course", function(req, res) {
  console.log("getAllGrades");

  myDB.getAllGrades(req.params.course, (grades) => {
    console.log("Got grades!");
    res.json(grades);
  });
});

module.exports = router;
