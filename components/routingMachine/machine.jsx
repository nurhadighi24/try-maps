import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

let carMarker = null;

const createRoutineMachineLayer = ({ selectedRoute }) => {
  const carIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  const waypointsOption1 = [
    L.latLng(-6.2251, 106.8019),
    L.latLng(-6.1754, 106.8272),
  ];
  const waypointsOption2 = [
    L.latLng(-6.1543, 106.856),
    L.latLng(-6.1754, 106.8272),
  ];

  const selectedWaypoints =
    selectedRoute === "kemayoran" ? waypointsOption2 : waypointsOption1;

  const instance = L.Routing.control({
    waypoints: selectedWaypoints,
    routeWhileDragging: false,
    lineOptions: {
      styles: [{ color: "#ff0000", weight: 6 }],
    },
    show: true,
    addWaypoints: false,
    createMarker: function (i, waypoint, n) {
      return L.marker(waypoint.latLng, {
        icon: L.icon({
          iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).bindPopup(`Waypoint ${i + 1}`);
    },
  });

  // Ubah tampilan panel instruksi agar lebih rapi
  instance.on("routesfound", function (e) {
    let route = e.routes[0].coordinates; // Ambil koordinat rute
    let map = instance._map; // Ambil map Leaflet
    // Hapus mobil lama jika ada
    if (carMarker) {
      map.removeLayer(carMarker);
    }

    // Tambahkan ikon mobil baru ke peta
    carMarker = L.marker(route[0], { icon: carIcon }).addTo(map);

    let i = 0;
    function moveCar() {
      if (i < route.length) {
        carMarker.setLatLng(route[i]); // Update posisi mobil
        i++;
        setTimeout(moveCar, 100); // Atur kecepatan pergerakan
      }
    }

    moveCar(); // Mulai animasi mobil

    // Styling Panel Instruksi
    let container = document.querySelector(".leaflet-routing-container");
    if (container) {
      container.style.backgroundColor = "white";
      container.style.padding = "10px";
      container.style.borderRadius = "8px";
      container.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      container.style.maxHeight = "300px";
      container.style.overflowY = "auto";
    }
  });

  return instance;
};

const RoutingMachine = createControlComponent((props) =>
  createRoutineMachineLayer(props)
);

export default RoutingMachine;
