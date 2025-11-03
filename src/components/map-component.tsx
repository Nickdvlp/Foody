"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  addresses: {
    restaurantCoords: { lat: number; lon: number };
    userCoords: { lat: number; lon: number };
  };
}

function FitBounds({ route }: { route: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route, map]);
  return null;
}

export default function MapComponent({ addresses }: RouteMapProps) {
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const body = {
        mode: "scooter",
        type: "balanced",
        traffic: "free_flow",
        agents: [
          {
            start_location: [
              addresses.userCoords.lon,
              addresses.restaurantCoords.lat,
            ],
            capabilities: [],
            time_windows: [],
            breaks: [],
          },
        ],
        jobs: [],
        shipments: [
          {
            id: "delivery_1",
            pickup: {
              location_index: 0,
              duration: 30,
              time_windows: [],
            },
            delivery: {
              location: [addresses.userCoords.lon, addresses.userCoords.lat],
              duration: 120,
              time_windows: [[0, 3600]],
            },
            requirements: [],
            priority: 50,
          },
        ],
        locations: [
          {
            location: [
              addresses.restaurantCoords.lon,
              addresses.restaurantCoords.lat,
            ],
            id: "restaurant",
          },
        ],
        avoid: [],
      };

      const res = await fetch(
        `https://api.geoapify.com/v1/routeplanner?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (data?.features?.[0]) {
        const coords = data.features[0].geometry.coordinates.map(
          ([lon, lat]: number[]) => [lat, lon]
        );
        setRoute(coords);
      }
    };

    fetchRoute();
  }, [addresses.restaurantCoords, addresses.userCoords]);

  return (
    <MapContainer
      center={[addresses.restaurantCoords.lat, addresses.restaurantCoords.lon]}
      zoom={13}
      style={{ height: "80vh", width: "100%" }}
      className="z-[1000]"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {route.length > 0 && (
        <>
          <Polyline positions={route} color="blue" weight={4} />
          <Marker position={route[0]}>
            <Popup>Restaurant</Popup>
          </Marker>
          <Marker position={route[route.length - 1]}>
            <Popup>Delivery Location</Popup>
          </Marker>
          <FitBounds route={route} />
        </>
      )}
    </MapContainer>
  );
}
