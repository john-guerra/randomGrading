import React, { useEffect, useState, useRef } from "react";
// import PropTypes from "prop-types";
import Lottery from "./Lottery";

import "./App.css";

import ListSelected from "./ListSelected";

const options = [
  "ARANGO RAMOS, JUAN DIEGO",
  "ARTEAGA MENDOZA, DANIELLA",
  "BAUTISTA ACOSTA, OMAR DAVID JOEL",
  "BEJARANO PUELLO, SARA  MARIA",
  "BRAVO CASTELO, JUAN SEBASTIAN",
  "CHACON BUITRAGO, VALENTINA",
  "CONTRERAS CASTELLANOS, JEISON MATEO",
  "CORINALDI CASTAÑO, ALLAN ROY",
  "CORREA PUERTA, JUAN PABLO",
  "ESTUPIÑAN GARAVITO, KELVIN SANTIAGO",
  "GARAVITO ROMERO, LUIS CARLOS",
  "LEON ALZATE, MATEO",
  "MARTINEZ NIÑO, JUAN SEBASTIAN",
  "NOREAU, ANTOINE",
  "ORGANISTA CALDERON, JOSE DANIEL",
  "OTALORA ROMERO, JUAN PABLO",
  "PARDO BORRERO, LAURA",
  "PARRA CORTES, VALERIE",
  "RIVEROS LANCHEROS, DIEGO FERNANDO",
  "RODRIGUEZ SERRANO, MARIANA",
  "RUIZ BOTERO, LUIS ALFONSO",
  "SANCHEZ RODRIGUEZ, JUAN CAMILO",
  "TORRES PIZA, JUAN FELIPE",
  "VACA TIBOCHA, JUAN SEBASTIAN"
];

const App = () => {
  const [todayGrades, setTodayGrades] = useState([]);
  const [optionSel, setOptionSel] = useState(null);
  const [lastOptionSel, setLastOptionSel] = useState(null);
  const [search, setSearch] = useState("");
  const inSearch = useRef();

  const refreshGrades = () => {
    fetch("getGrades")
      .then(res => res.json())
      .then(grades => {
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
    const matches = options.find(o => reg.test(o));

    console.log("matches", matches);

    if (matches) {
      setLastOptionSel(optionSel);
      setOptionSel({ name: matches });
    }
  };

  useEffect(refreshGrades, []);

  console.log("App grades", optionSel);

  return (
    <div className="App">
      <h1>Class participation</h1>
      <div>
        <Lottery
          options={options}
          setOptionSel={setOptionSel}
          optionsDrawn={todayGrades}
        ></Lottery>

        <div>
          <br />
          <br />
          <label>
            Search
            <input
              type="text"
              ref={inSearch}
              value={search}
              onChange={onSearch}
            />
          </label>
        </div>

        <div id="drawnBox" className="bgWhite">
          {optionSel ? (
            <div>
              <h2>Drawn</h2>
              <div className="selected">
                <div>
                  <div>{optionSel.name}</div>
                </div>
              </div>
            </div>
          ) : (
            <span></span>
          )}

          <h2>History</h2>
          <div id="drawn">
            <ListSelected
              optionsDrawn={todayGrades}
              optionSel={optionSel}
              onSelect={refreshGrades}
            ></ListSelected>
          </div>
        </div>
      </div>
    </div>
  );
};

// App.propTypes = {};

export default App;
