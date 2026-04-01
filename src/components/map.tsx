"use client";

import { MapContainer, TileLayer, Marker } from 'react-leaflet';

  

const Map = () => {
  return (
    /* 1. Wrap in a div with a fixed height */
    <div style={{ height: "400px", width: "100%" }}> 
      <MapContainer 
        center={[9.50, -13.70]} 
        zoom={13} 
        scrollWheelZoom={false}
        /* 2. Ensure styles are applied to the container */
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[9.50, -13.70]} />
      </MapContainer>
    </div>
  );
};

export default Map;