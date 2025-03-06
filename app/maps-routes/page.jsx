"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from "@/components/routingMachine/machine";
import L from "leaflet";

export default function MapsRoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState("senayan");

  return (
    <div>
      <select
        onChange={(e) => setSelectedRoute(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        <option value="senayan">Rute Senayan ke Monas</option>
        <option value="kemayoran">Rute Kemayoran ke Monas</option>
      </select>

      <MapContainer
        center={[-6.1754, 106.8272]}
        zoom={6}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <RoutingMachine key={selectedRoute} selectedRoute={selectedRoute} />
      </MapContainer>
    </div>
  );
}
