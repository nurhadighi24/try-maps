"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapsIn() {
  const monasPosition = [-6.1754, 106.8272];
  const senayanPosition = [-6.2251, 106.8019];
  const kemayoranPosition = [-6.1523, 106.865];

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("senayan");
  const [carPosition, setCarPosition] = useState(senayanPosition);

  const markerIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
  });

  // Ikon Mobil
  const carIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png", // Icon mobil
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  useEffect(() => {
    const fetchRoute = async () => {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const start =
        selectedRoute === "senayan"
          ? `${senayanPosition[1]},${senayanPosition[0]}`
          : `${kemayoranPosition[1]},${kemayoranPosition[0]}`;
      const end = `${monasPosition[1]},${monasPosition[0]}`;

      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);

        if (data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates.map((coord) => [
            coord[1], // Latitude
            coord[0], // Longitude
          ]);

          console.log("Processed Coordinates:", coords);
          setRouteCoordinates(coords);
          setCarPosition(coords[0]); // Posisi mobil di titik awal
          animateCar(coords); // Jalankan animasi
        } else {
          console.error("No valid route data:", data);
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRoute();
  }, [selectedRoute]);

  // Fungsi untuk menggerakkan ikon mobil mengikuti rute
  const animateCar = (coords) => {
    let index = 0;
    const moveCar = () => {
      if (index < coords.length) {
        setCarPosition(coords[index]); // Update posisi mobil
        index++;
        setTimeout(moveCar, 200);
      }
    };
    moveCar();
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <label>Pilih Rute: </label>
        <select
          onChange={(e) => setSelectedRoute(e.target.value)}
          value={selectedRoute}
        >
          <option value="senayan">Senayan ke Monas</option>
          <option value="kemayoran">Kemayoran ke Monas</option>
        </select>
      </div>

      <MapContainer
        center={monasPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={monasPosition} icon={markerIcon}>
          <Popup>Monas - Monumen Nasional Indonesia</Popup>
        </Marker>
        <Marker position={senayanPosition} icon={markerIcon}>
          <Popup>Senayan</Popup>
        </Marker>
        <Marker position={kemayoranPosition} icon={markerIcon}>
          <Popup>Kemayoran</Popup>
        </Marker>
        {routeCoordinates.length > 0 && (
          <Polyline weight={5} positions={routeCoordinates} color="blue" />
        )}

        {/* Marker untuk mobil yang bergerak */}
        <Marker position={carPosition} icon={carIcon}>
          <Popup>Mobil Sedang Bergerak</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
