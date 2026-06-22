import React, { useState } from "react";
import { regionsData } from "../coordonnees";

export default function MapSenegal() {
  const [regionActiveId, setRegionActiveId] = useState(null);

  const activeRegion = regionsData.find((region) => region.id === regionActiveId);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif" }}>
      
      <div style={{ height: "40px", fontSize: "1.5rem", fontWeight: "bold", margin: "10px 0", color: "#333" }}>
        {activeRegion ? activeRegion.name : "Survolez une région"}
      </div>

      <svg baseProfile="tiny" fill="#565d56" height="736" stroke="#ffffff"strokeLinecap="round"
           strokeLinejoin="round"strokeWidth=".5"version="1.2" viewBox="0 0 1000 736" width="1000" xmlns="http://www.w3.org/2000/svg">
            <g id="features">
                {regionsData.map((region) => (
                    <path key={region.id} id={region.id} name={region.name} d={region.d}
                    style={{ fill: regionActiveId === region.id ? "#053510" : "#565d56", transition: "fill 0.2s ease",}} onMouseEnter={() => setRegionActiveId(region.id)} onMouseLeave={() => setRegionActiveId(null)}/>
                ))}
            </g>
      </svg>
    </div>
  );
}