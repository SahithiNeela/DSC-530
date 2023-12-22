import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a map of Germany.
 */

function GeoChart({ data, property, year }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(data.features, (feature) =>
      feature.properties[property] ? feature.properties[property][year] : 0
    );
    const maxProp = max(data.features, (feature) =>
      feature.properties[property] ? feature.properties[property][year] : 0
    );
    const colors = [
      "#caf0f8",
      "#90e0ef",
      "#48cae4",
      "#0096c7",
      "#0077b6",
      "#03045e",
    ];
    const getColor = (value) => {
      if (value == 0) return "#ddd";
      if (value < 1000000000) return colors[0];
      if (value < 5000000000) return colors[1];
      if (value < 10000000000) return colors[2];
      if (value < 50000000000) return colors[3];
      if (value < 100000000000) return colors[4];
      return colors[5];
    };

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (event, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", (feature) =>
        getColor(
          feature.properties[property] ? feature.properties[property][year] : 0
        )
      )
      .attr("d", (feature) => pathGenerator(feature));

    // render text
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        (feature) =>
          feature &&
          feature.properties.name +
            ": " +
            (feature.properties[property][year] == 0
              ? "No Data"
              : feature.properties[property][year]
            ).toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, selectedCountry, year]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
