import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import "./ListSelected.css";

function sendPost(url, body) {
  const strGrade = JSON.stringify(body);
  console.log("send grade", strGrade);

  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    // body: "" // body data type must match "Content-Type" header
    body: strGrade // body data type must match "Content-Type" header
  }).then(res => res.json());
}

const ListSelected = props => {
  console.log("ListSelected", props);

  function sendGrade(name, grade, timestamp) {
    return sendPost("setGrade", { name, grade, timestamp }).then(res => {
      props.onSelect(res);

      return res;
    });
  }

  function sendDelete(name, grade, timestamp) {
    if (
      window.confirm(
        `Do you really want to delete? ${name} ${grade} ${timestamp}`
      )
    ) {
      sendPost("delete", { name, grade, timestamp }).then(res => {
        console.log("delete response", res);
        props.onSelect();

        return res;
      });
    }
  }

  if (props.optionSel) {
    d3.select("body").on("keyup", () => {
      switch (d3.event.key) {
        case "-":
          sendGrade(props.optionSel.name, -1);
          break;
        case "0":
          sendGrade(props.optionSel.name, 0);
          break;
        case "1":
          sendGrade(props.optionSel.name, 1);
          break;
        case "2":
          sendGrade(props.optionSel.name, 2);
          break;
        default:
          break;
      }
    });
  }

  function renderOptions() {
    return props.optionsDrawn.map((option, i) => (
      <div className="optionsDrawn" key={i}>
        <span className="name">{option.name}</span>
        &nbsp;
        <span className="grade">
          {option.grade !== null ? option.grade : "_"}
        </span>
        <button
          onClick={() => sendGrade(option.name, -1, option.timestamp)}
          className="btnMinusOne"
        >
          -1
        </button>
        <button
          onClick={() => sendGrade(option.name, 0, option.timestamp)}
          className="btnZero"
        >
          0
        </button>
        <button
          onClick={() => sendGrade(option.name, 1, option.timestamp)}
          className="btnOne"
        >
          1
        </button>
        <button
          onClick={() => sendGrade(option.name, 2, option.timestamp)}
          className="btnTwo"
        >
          2
        </button>
        <button
          onClick={() => sendDelete(option.name, 2, option.timestamp)}
          className="btnDelete"
        >
          ❌
        </button>
      </div>
    ));
  }

  return <span>{renderOptions()}</span>;
};

ListSelected.propTypes = {
  optionsDrawn: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default ListSelected;
