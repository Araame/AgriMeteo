import React, { useState } from "react";
import { regionsData } from "../coordonnees";
export default function MapSenegal({ etatSidebar, ...props }) {
  const [regionActiveId, setRegionActiveId] = useState(null);

  const recupererNomRegionClick = (regionName) => {
    if (props.onRegionClick) {
      props.onRegionClick(regionName);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        marginLeft: etatSidebar ? "398px" : "160px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <svg
        baseProfile="tiny"
        fill="#565d56"
        height="500"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".5"
        version="1.2"
        viewBox="0 0 1000 736"
        width="800"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer" }}
      >
        <g id="features">
          {regionsData.map((region) => (
            <path
              key={region.id}
              id={region.id}
              name={region.name}
              d={region.d}
              style={{
                fill: regionActiveId === region.id ? "#053510" : "#565d56",
                transition: "fill 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={() => setRegionActiveId(region.id)}
              onMouseLeave={() => setRegionActiveId(null)}
              onClick={() => recupererNomRegionClick(region.name)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}