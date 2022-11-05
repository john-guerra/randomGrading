/* global d3 */
var options = d3.shuffle([
  "Bhawania, Sadiya Iqbal Dawood",
"Bosko, Katerina",
"Crawley, Tim",
"Khouri, Elio F.",
"Lei, Yuyan",
"Li, Yunxiao",
"Lopez, Cecilia R.",
"Lu, Tianyu",
"Mathew, Anshul",
"Sarkisian, Armen",
"Shi, Zitong",
"Siegel, Ilana-Mahmea",
"Sun, Guoqin",
"Tang, Ting",
"Wang, Rongchang",
"Wang, Tianchang",
"Wu, Chenjie",
"Wu, Cuichan",
"Xie, Yixiang",
"Xu, Shu",
"Xu, Wanting",
"Zhang, Yifan",
"Zhou, Jianhao",
"Zhou, Yukun",
"Zhu, Taohan",
"Zou, Yuxiao",
"Asala, Jeremiah O.",
"Au-Yeung, So Man Amanda",
"Bi, Xingjian",
"Chen, Ke",
"Chen, Kuan-Tsa",
"Chen, YiAn",
"Deng, Han",
"Gajjar, Harshit Bhavesh",
"Hu, Hui",
"Lee, Ming Hsiu",
"Leung, Aaron",
"Mesia, Mihir Himmatbhai",
"Shao, Yuting",
"Sorho, Founyakon S.",
"Sulgante, Akhila",
"Tseng, Chun-Wei",
"Wang, Yuan",
"Xu, Zihan",
"Yang, Weihong",
"Zhang, Gaoxiang",
"Zheng, Lingyi",
]);

// https://cmatskas.com/get-url-parameters-using-javascript/
var parseQueryString = function (url) {
  var urlParams = {};
  url.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function ($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );

  return urlParams;
};

var params = parseQueryString(location.search);
if (params && params.section === "2") {
  options = [];
}

var allOptions = options.map(function (d, i) {
  return { name: d, id: i, drawn: false };
});
var optionsLeft = allOptions.map(function (d) {
  return d;
});
var optionsDrawn = [];

var width = 800,
  height = 800,
  endAngle = 360 - 360 / options.length;

var svg = d3
  .select("#result")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var angleScale = d3
  .scaleLinear()
  .domain([0, options.length - 1])
  .range([0, endAngle]);

d3.select("#btnChoose").on("click", onChoose);

function redraw(options) {
  var optionsSel = svg.selectAll(".option").data(options);

  const opEnter = optionsSel.enter().append("text").attr("class", "option");

  optionsSel
    .merge(opEnter)
    // .attr("x", width/2)
    // .attr("y", height/2)
    .attr("id", function (d) {
      return "id" + d.id;
    })
    .classed("drawn", function (d) {
      return d.drawn;
    })
    .text(function (d) {
      return d.name;
    })
    .transition()
    .duration(1000)
    .attr("transform", function (d) {
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

  optionsSel.exit().remove();
}

redraw(allOptions);

async function sendGrade(name, grade, gradeElementSel) {
  // Default options are marked with *

  const strGrade = JSON.stringify({ name, grade });
  console.log("send grade", strGrade);
  const response = await fetch("setGrade", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    // body: "" // body data type must match "Content-Type" header
    body: strGrade, // body data type must match "Content-Type" header
  });
  return await response.json().then((res) => {
    gradeElementSel.text(grade);

    return res;
  });
}

function onChoose() {
  var sel = Math.floor(Math.random() * optionsLeft.length);
  var optionSel = optionsLeft.splice(sel, 1)[0];

  if (optionSel === undefined) {
    console.log("No more options left");
    alert("No more options left"); // Optional
  }

  optionSel.drawn = true;
  optionsDrawn = [optionSel].concat(optionsDrawn);
  angleScale.range([0, endAngle]);
  var selAngle = angleScale(optionSel.id);

  console.log(
    "sel=" + sel + " angle=" + selAngle + " option " + optionSel.name
  );

  angleScale.range([-selAngle, endAngle - selAngle]);
  console.log("#id " + sel);
  d3.selectAll(".option").classed("selected", false);
  redraw(allOptions);
  console.log("#id" + optionSel.id);
  d3.select("#id" + optionSel.id).classed("selected", true);

  d3.select("body").on("keyup", () => {
    switch (d3.event.key) {
      case "-":
        sendGrade(optionSel, -1, d3.select("#drawn").select("span.grade"));
        break;
      case "0":
        sendGrade(optionSel, 0, d3.select("#drawn").select("span.grade"));
        break;
      case "1":
        sendGrade(optionSel, 1, d3.select("#drawn").select("span.grade"));
        break;
      case "2":
        sendGrade(optionSel, 2, d3.select("#drawn").select("span.grade"));
        break;
    }
  });

  var drawn = d3.select("#drawn").selectAll("div.drawn").data(optionsDrawn);

  const drawnEnter = drawn.enter().append("div").attr("class", "drawn");

  drawnEnter
    .append("span")
    .attr("class", "name")
    .merge(drawn.select("span.name"))
    .text((d) => d.name);

  drawnEnter
    .append("span")
    .attr("class", "grade")
    .merge(drawn.select("span.grade"))
    .text("_");

  drawnEnter
    .append("button")
    .attr("class", "btnMinusOne")
    .merge(drawn.select("button.btnMinusOne"))
    .text("-1")
    .on("click", function (d) {
      sendGrade(d.name, -1, d3.select(this.parentElement).select("span.grade"));
    });

  drawnEnter
    .append("button")
    .attr("class", "btnZero")
    .merge(drawn.select("button.btnZero"))
    .text("0")
    .on("click", function (d) {
      sendGrade(d.name, 0, d3.select(this.parentElement).select("span.grade"));
    });

  drawnEnter
    .append("button")
    .attr("class", "btnOne")
    .merge(drawn.select("button.btnOne"))
    .text("1")
    .on("click", function (d) {
      sendGrade(d.name, 1, d3.select(this.parentElement).select("span.grade"));
    });

  drawnEnter
    .append("button")
    .attr("class", "btnTwo")
    .merge(drawn.select("button.btnTwo"))
    .text("2")
    .on("click", function (d) {
      sendGrade(d.name, 2, d3.select(this.parentElement).select("span.grade"));
    });

  drawn.exit().remove();
}
