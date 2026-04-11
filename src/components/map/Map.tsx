import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

type LatLng = [number, number];

type MapClickProps = {
  setPosition: (pos: LatLng) => void;
};

type MapProps = {
  create?: boolean,
  position?: [number,number],
  setLocation?: (pos: LatLng) => void
}

function MapClick({ setPosition }: MapClickProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Fix marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const logPosition = (pos: LatLng) => {
  console.log(pos)
}

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ create , position = [33.5731, -7.5898] , setLocation = logPosition}: MapProps) {
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);

  const updatePosition = (pos: LatLng) => {
    setSelectedPosition(pos)
    setLocation(pos)
  }

  if (create) return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "400px", width: "400px" , cursor: "pointer"}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      // Handle clicks 
      <MapClick setPosition={updatePosition} />

      {!selectedPosition && <Marker position={position}></Marker>}
      // User selected marker 
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>
            Lat: {selectedPosition[0].toFixed(5)} <br />
            Lng: {selectedPosition[1].toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
  else return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "400px", width: "400px" , cursor: "pointer"}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}></Marker>
    </MapContainer>
  )
}