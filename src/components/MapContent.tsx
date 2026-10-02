'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapContent() {
  const position: [number, number] = [49.9884, 36.2328]; // Координаты (например, Харьков)

  return (
    <div className="container-fluid p-0">
      <h2 className="h4 fw-bold mb-4 text-dark">Геолокация объектов</h2>
      <div className="bg-white p-3 rounded-4 shadow-sm w-100" style={{ height: '500px' }}>
        <div style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customIcon}>
              <Popup>Главный офис / Склад</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}