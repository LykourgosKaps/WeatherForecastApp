import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SelectMultiple } from "./SelectMultiple.jsx";

const regions = [
  { name: "Greece", lat: 37.98, lon: 23.72, hazard: "Rain", probability: "Medium", magnitude: "Low" },
  { name: "Cyprus", lat: 35.18, lon: 33.38, hazard: "Rain", probability: "Medium", magnitude: "Low" },
  { name: "Portugal", lat: 38.72, lon: -9.13, hazard: "Rain", probability: "Medium", magnitude: "Low" },

  { name: "France", lat: 48.85, lon: 2.35, hazard: "Rain", probability: "High", magnitude: "Medium" },
  { name: "UK", lat: 51.5, lon: -0.12, hazard: "Rain", probability: "High", magnitude: "Medium" },
  { name: "Belgium", lat: 50.85, lon: 4.35, hazard: "Rain", probability: "High", magnitude: "Medium" },

  { name: "Japan", lat: 35.67, lon: 139.65, hazard: "Rain", probability: "High", magnitude: "High" },
  { name: "Philippines", lat: 14.59, lon: 120.98, hazard: "Rain", probability: "High", magnitude: "High" },
  { name: "Indonesia", lat: -6.2, lon: 106.81, hazard: "Rain", probability: "High", magnitude: "High" },

  { name: "Italy", lat: 41.9, lon: 12.49, hazard: "Drought", probability: "High", magnitude: "Medium" },
  { name: "Turkey", lat: 39.93, lon: 32.85, hazard: "Drought", probability: "High", magnitude: "Medium" },
  { name: "Morocco", lat: 34.02, lon: -6.84, hazard: "Drought", probability: "High", magnitude: "Medium" },

  { name: "Spain", lat: 40.41, lon: -3.7, hazard: "Drought", probability: "High", magnitude: "High" },
  { name: "Egypt", lat: 30.04, lon: 31.23, hazard: "Drought", probability: "High", magnitude: "High" },
  { name: "Saudi Arabia", lat: 24.71, lon: 46.67, hazard: "Drought", probability: "High", magnitude: "High" },

  { name: "Germany", lat: 52.52, lon: 13.4, hazard: "Snow", probability: "Low", magnitude: "High" },
  { name: "Austria", lat: 48.2, lon: 16.37, hazard: "Snow", probability: "Low", magnitude: "High" },
  { name: "Switzerland", lat: 46.94, lon: 7.44, hazard: "Snow", probability: "Low", magnitude: "High" },

  { name: "Norway", lat: 59.91, lon: 10.75, hazard: "Snow", probability: "High", magnitude: "High" },
  { name: "Sweden", lat: 59.32, lon: 18.06, hazard: "Snow", probability: "High", magnitude: "High" },
  { name: "Finland", lat: 60.16, lon: 24.93, hazard: "Snow", probability: "High", magnitude: "High" },
];

const hazardOptions = ["Rain", "Snow", "Drought"];
const levelOptions = ["Low", "Medium", "High"];

function App() {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [hazardFilters, setHazardFilters] = useState([]);
  const [probabilityFilters, setProbabilityFilters] = useState([]);
  const [magnitudeFilters, setMagnitudeFilters] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    mapRef.current = L.map("map").setView([20, 0], 2);

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
      {
        attribution: "© Mapbox",
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(mapRef.current);

    return () => mapRef.current.remove();
  }, []);

  const applyFilters = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const filtered = regions.filter((region) => {
      const hazardMatch =
        hazardFilters.length === 0 || hazardFilters.includes(region.hazard);

      const probabilityMatch =
        probabilityFilters.length === 0 ||
        probabilityFilters.includes(region.probability);

      const magnitudeMatch =
        magnitudeFilters.length === 0 ||
        magnitudeFilters.includes(region.magnitude);

      return hazardMatch && probabilityMatch && magnitudeMatch;
    });

    setResults(filtered);

    filtered.forEach((region) => {
      const marker = L.marker([region.lat, region.lon])
        .addTo(mapRef.current)
        .bindPopup(
          `<b>${region.name}</b><br/>
           Hazard: ${region.hazard}<br/>
           Probability: ${region.probability}<br/>
           Magnitude: ${region.magnitude}`
        );

      markersRef.current.push(marker);
    });

    setHazardFilters([]);
    setProbabilityFilters([]);
    setMagnitudeFilters([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Climate Hazard Map</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <SelectMultiple
          filterType="Hazards"
          filterOptions={hazardOptions}
          filters={hazardFilters}
          setFilters={setHazardFilters}
        />

        <SelectMultiple
          filterType="Probability"
          filterOptions={levelOptions}
          filters={probabilityFilters}
          setFilters={setProbabilityFilters}
        />

        <SelectMultiple
          filterType="Magnitude"
          filterOptions={levelOptions}
          filters={magnitudeFilters}
          setFilters={setMagnitudeFilters}
        />
      </div>

      <button
        onClick={applyFilters}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Apply Filters
      </button>

      <div id="map" style={{ height: "500px", width: "100%" }}></div>

      <h2>Results: {results.length}</h2>

      {results.map((region) => (
        <div key={region.name}>
          <strong>{region.name}</strong> — {region.hazard}, Probability:{" "}
          {region.probability}, Magnitude: {region.magnitude}
        </div>
      ))}
    </div>
  );
}

export default App;