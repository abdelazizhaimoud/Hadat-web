import React from 'react'
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';

function MapClick() {
  useMapEvents({
    click(e) {
      console.log(e.latlng);
    },
  });
  return null;
}
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const position: [number, number] = [33.5731, -7.5898]; // Casablanca

const markers: [number, number][] = [
  [33.57, -7.58],
  [33.58, -7.60],
];





export default function Map() {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={position}>
        <Popup>
          Hello from Casablanca 🚀
        </Popup>
      </Marker>
      {markers.map((pos, i) => (
        <Marker key={i} position={pos} />
        ))}
    </MapContainer>
  );
}
