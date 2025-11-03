"use client";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconUrl: "/map-images/marker-icon.png",
  iconRetinaUrl: "/map-images/marker-icon-2x.png",
  shadowUrl: "/map-images/marker-shadow.png",
});

interface MapProps {
  addresses: {
    userCoords: "We couldn't find that address!" | { lat: number; lon: number };
    restaurantCoords:
      | "We couldn't find that address!"
      | { lat: number; lon: number };
  };
}

const MapComponent = ({ addresses }: MapProps) => {
  if (
    typeof addresses.userCoords === "string" ||
    typeof addresses.restaurantCoords === "string"
  ) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Unable to locate address on map.
      </div>
    );
  }

  const user = addresses.userCoords;
  const restaurant = addresses.restaurantCoords;

  const center = [
    (user.lat + restaurant.lat) / 2,
    (user.lon + restaurant.lon) / 2,
  ];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={12}
      className="h-full w-full z-10"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Restaurant marker */}
      <Marker position={[restaurant.lat, restaurant.lon]}>
        <Popup>Restaurant Location</Popup>
      </Marker>

      {/* User marker */}
      <Marker position={[user.lat, user.lon]}>
        <Popup>Delivery Address</Popup>
      </Marker>

      {/* Line between them */}
      <Polyline
        positions={[
          [restaurant.lat, restaurant.lon],
          [user.lat, user.lon],
        ]}
      />
    </MapContainer>
  );
};

export default MapComponent;
