import React, { useState, useEffect } from "react";
// import Video from "./Video";
import GeoChart from "./GeoChart";
import data from "./GeoChart.world.geo.json";
import "./App.css";
import { pointer } from "d3";

function App() {
  const [property, setProperty] = useState("military_expenditure");
  const [year, setYear] = useState(1949);
  const [play, setPlay] = useState(false);
  const [id, setId] = useState(null);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     if (year < 2021 && play) setYear((year) => year + 1);
  //   }, 1000);

  //   return () => {
  //     clearInterval(id);
  //   };
  // }, [play]);
  const colorData = [
    ["#ddd", "No Data"],
    ["#caf0f8", "< $1 Billion"],
    ["#90e0ef", "< $5 Billion"],
    ["#48cae4", "< $10 Billion"],
    ["#0096c7", "< $50 Billion"],
    ["#0077b6", "< $100 Billion"],
    ["#03045e", "> $100 Billion"],
  ];

  /*const startPlaying = () => {
    setPlay(!play);
    setId(
      setInterval(() => {
        setYear((oldYear) => Number(oldYear) + 1);
      }, 100)
    );
  };*/

  const startPlaying = () => {
    if (year != 2020) {
      setPlay(!play);
      setId(
        setInterval(() => {
          setYear((oldYear) => Number(oldYear) + 1);
        }, 100)
      );
    }
  };

  
  useEffect(() => {
    if (id && year == 2020) {
      clearInterval(id);
      setPlay(!play);
    }
  }, [year]);
  const getYear = () => year;
  const stopPlaying = () => {
    clearInterval(id);
    setPlay(!play);
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <GeoChart data={data} property={property} year={year} />
        </div>
        <div style={{marginLeft: 20}}>
          {colorData.map((data) => (
            <div
              style={{ display: "flex", width: 200, alignItems: "center" }}
              key={data[0]}
            >
              <div style={{ width: 45, height: 25, background: data[0] }} />
              <p style={{ marginLeft: 10, fontWeight: 600 }}>{data[1]}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <select
        value={property}
        onChange={(event) => setProperty(event.target.value)}
      >
        <option value="pop_est">Population</option>
        <option value="name_len">Name length</option>
        <option value="gdp_md_est">GDP</option>
      </select> */}
      <p style={{ marginRight: '200px' }}>{year}</p>
      <div style={{ display: "flex" }}>
        <div
          onClick={() => {
            if (play) stopPlaying();
            else startPlaying();
          }}
          style={{ cursor: "pointer", width: 60 }}
        >
          {play ? "Pause" : "Play"}
        </div>
        <input
          type="range"
          style={{ width: "70%" }}
          min={1949}
          max={2020}
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
          }}
        />
      </div>
      {/* <Video /> */}
    </React.Fragment>
  );
}

export default App;
