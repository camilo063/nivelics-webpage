"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AMERICAS_CODES = [
  "032",
  "068",
  "076",
  "152",
  "170",
  "188",
  "192",
  "214",
  "218",
  "222",
  "320",
  "328",
  "332",
  "340",
  "388",
  "484",
  "558",
  "591",
  "600",
  "604",
  "740",
  "780",
  "840",
  "858",
  "862",
];

const MARKERS = [
  { name: "Colombia", lat: 4.71, lng: -74.07, isHQ: true },
  { name: "USA", lat: 25.77, lng: -80.19, isHQ: false },
  { name: "México", lat: 19.43, lng: -99.13, isHQ: false },
  { name: "El Salvador", lat: 13.69, lng: -89.19, isHQ: false },
  { name: "Panamá", lat: 8.99, lng: -79.52, isHQ: false },
  { name: "Ecuador", lat: -0.22, lng: -78.51, isHQ: false },
  { name: "Perú", lat: -12.05, lng: -77.04, isHQ: false },
  { name: "Argentina", lat: -34.6, lng: -58.38, isHQ: false },
];

export function AmericaMap() {
  return (
    <div
      className="relative w-full max-w-md mx-auto"
      role="img"
      aria-label="Mapa de presencia de Nivelics en América"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-70, 0], scale: 350 }}
        width={400}
        height={600}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => {
                const id = String(geo.id || geo.properties?.["ISO_A3_EH"] || "");
                return (
                  AMERICAS_CODES.includes(id) ||
                  geo.properties?.continent === "South America" ||
                  geo.properties?.continent === "North America"
                );
              })
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
          }
        </Geographies>

        {MARKERS.map((marker, i) => (
          <Marker key={marker.name} coordinates={[marker.lng, marker.lat]}>
            {/* Pulse halo */}
            <circle
              r={marker.isHQ ? 10 : 8}
              fill="rgba(0,212,255,0.2)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            {/* Center dot */}
            <circle r={marker.isHQ ? 4 : 3} fill="#00D4FF" />
            {/* Label */}
            <text
              textAnchor="start"
              x={12}
              y={4}
              style={{
                fontSize: 10,
                fill: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              {marker.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
