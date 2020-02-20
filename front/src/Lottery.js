import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

// // https://cmatskas.com/get-url-parameters-using-javascript/
// const parseQueryString = function(url) {
//   const urlParams = {};
//   url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function(
//     $0,
//     $1,
//     $2,
//     $3
//   ) {
//     urlParams[$1] = $3;
//   });

//   return urlParams;
// };

const Lottery = props => {
  const options = d3.shuffle(props.options);

  // const [optionsDrawn, setOptionsDrawn] = useState([]);

  // const params = parseQueryString(location.search);
  // if (params && params.section === "2") {
  //   options = [];
  // }

  const allOptions = options.map(function(d, i) {
    return { name: d, id: i, drawn: false };
  });

  //Create a hash of drawn names
  const hashNamesDrawn = [];
  props.optionsDrawn.forEach(d => (hashNamesDrawn[d.name] = 1));

  // Remaining options
  const optionsLeft = allOptions.filter(
    d => hashNamesDrawn[d.name] === undefined
  );

  console.log("Options Left", optionsLeft.length);

  const resultRef = useRef();

  const width = 800,
    height = 800,
    endAngle = 360 - 360 / options.length;

  const angleScale = d3
    .scaleLinear()
    .domain([0, options.length - 1])
    .range([0, endAngle]);

  // Redraw
  function redraw() {
    const options = allOptions;
    console.log("redraw", options);

    const svg = d3
      .select(resultRef.current)
      .selectAll("svg")
      .data([options])
      .join("svg")
      .attr("width", width)
      .attr("height", height);

    const optionsSel = svg.selectAll(".option").data(options);

    const opEnter = optionsSel
      .enter()
      .append("text")
      .classed("option", "true")
      .classed("drawn", d => hashNamesDrawn[d.name]);

    const translate = sel =>
      sel.attr("transform", function(d) {
        return (
          "translate(" +
          (width / 2 - 7 * options.length) +
          "," +
          height / 2 +
          ") rotate(" +
          angleScale(d.id) +
          ")" +
          ", translate(" +
          7 * options.length +
          ",0)"
        );
      });

    optionsSel
      .merge(opEnter)
      // .attr("x", width/2)
      // .attr("y", height/2)
      .attr("id", function(d) {
        return "id" + d.id;
      })
      .classed("drawn", d => hashNamesDrawn[d.name])
      .text(d => d.name)
      .transition()
      .duration(1000)
      .call(translate);

    optionsSel.exit().remove();
  }

  function onChoose() {
    const sel = Math.floor(Math.random() * optionsLeft.length);
    const tmpOptionSel = optionsLeft.splice(sel, 1)[0];
    console.log("onChoose", sel);

    if (tmpOptionSel === undefined) {
      console.log("No more options left");
      alert("No more options left"); // Optional
      return;
    }

    tmpOptionSel.drawn = true;

    angleScale.range([0, endAngle]);
    const selAngle = angleScale(tmpOptionSel.id);

    console.log(
      "sel=" + sel + " angle=" + selAngle + " option " + tmpOptionSel.name
    );

    angleScale.range([-selAngle, endAngle - selAngle]);
    console.log("#id " + sel);
    d3.selectAll(".option").classed("selected", false);
    redraw();

    console.log("#id" + tmpOptionSel.id);
    d3.select("#id" + tmpOptionSel.id).classed("selected", true);

    props.setOptionSel(tmpOptionSel);
    // setOptionsDrawn([tmpOptionSel].concat(optionsDrawn));
  }

  // Do only once
  useEffect(() => {
    redraw();
  }, [props.options]);

  return (
    <div className="Lottery">
      <button id="btnChoose" onClick={onChoose}>
        Do you feel lucky?
      </button>

      <small>Options left: {optionsLeft.length}</small>

      <div id="result" ref={resultRef}></div>
    </div>
  );
};

Lottery.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOptionSel: PropTypes.func.isRequired,
  optionsDrawn: PropTypes.array.isRequired
};

export default Lottery;
