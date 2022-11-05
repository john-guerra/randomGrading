import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Lottery from "./Lottery";
import "./App.css";
import ListSelected from "./ListSelected";

import { classes } from "./students.mjs";

const App = () => {
  const [course, setCourse] = useState(Object.keys(classes)[0]);
  const [options, setOptions] = useState(classes[course]);
  const [todayGrades, setTodayGrades] = useState([]);
  const [optionSel, setOptionSel] = useState(null);
  const [lastOptionSel, setLastOptionSel] = useState(null);
  const [search, setSearch] = useState("");
  const inSearch = useRef();
  const refreshGrades = () => {
    fetch("getGrades/" + course)
      .then((res) => res.json())
      .then((grades) => {
        setTodayGrades(grades);
      });
  };
  const onSearch = () => {
    const searchedStr = inSearch.current.value;
    setSearch(searchedStr);
    if (searchedStr === "") {
      setOptionSel(lastOptionSel);
      return;
    }
    const reg = new RegExp(`.*${searchedStr}.*`, "i");
    const matches = options.find((o) => reg.test(o));
    console.log("matches", matches);
    if (matches) {
      setLastOptionSel(optionSel);
      setOptionSel({ name: matches });
    }
  };
  useEffect(refreshGrades, []);

  const onChangeCourse = (evt) => {
    console.log("course", evt.target.value);
    setCourse(evt.target.value);
    setOptions(classes[evt.target.value]);
  };

  const renderCourseSelector = () => {
    return (
      <div>
        <label>
          Course:{" "}
          <select name="course" onChange={onChangeCourse}>
            {Object.keys(classes).map((c) => (
              <option value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
    );
  };

  console.log("App grades", optionSel);
  return (
    <div className="App">
      {" "}
      <h1>Class participation</h1> {renderCourseSelector()}
      <div>
        {" "}
        <Lottery
          options={options}
          setOptionSel={setOptionSel}
          optionsDrawn={todayGrades}
        ></Lottery>{" "}
        <div>
          {" "}
          <br /> <br />{" "}
          <label>
            {" "}
            Search{" "}
            <input
              type="text"
              ref={inSearch}
              value={search}
              onChange={onSearch}
            />{" "}
          </label>{" "}
        </div>{" "}
        <div id="drawnBox" className="bgWhite">
          {" "}
          {optionSel ? (
            <div>
              {" "}
              <h2>Drawn</h2>{" "}
              <div className="selected">
                {" "}
                <div>
                  {" "}
                  <div>{optionSel.name}</div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ) : (
            <span></span>
          )}{" "}
          <h2>History</h2>{" "}
          <div id="drawn">
            {" "}
            <ListSelected
              course={course}
              optionsDrawn={todayGrades}
              optionSel={optionSel}
              onSelect={refreshGrades}
            ></ListSelected>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
App.propTypes = {};
export default App;
