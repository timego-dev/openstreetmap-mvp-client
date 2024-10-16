import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const RenderControl = () => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      navigator.geolocation.getCurrentPosition((result) => {
        map.flyTo(
          {
            lat: result.coords.latitude,
            lng: result.coords.longitude,
          },
          10
        );
      });
    }
  }, [map]);
  return (
    <div className="fixed top-0 left-0 z-999999">
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
};

const RenderMap = () => {
  return (
    <MapContainer
      className="markercluster-map"
      center={[51.0, 19.0]}
      zoom={4}
      maxZoom={18}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <RenderControl />
    </MapContainer>
  );
};

export default RenderMap;
