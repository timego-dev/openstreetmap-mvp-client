import { FC, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

interface IProps {
  lat: number;
  long: number;
}

const RenderControl: FC<IProps> = ({ lat, long }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.flyTo(
        {
          lat,
          lng: long,
        },
        15
      );
    }
  }, [map, lat, long]);
  return null;
};

const RenderMap: FC<IProps> = ({ lat, long }) => {
  return (
    <MapContainer
      className="markercluster-map"
      center={[lat, long]}
      zoom={15}
      maxZoom={100}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, long]}></Marker>
      <RenderControl lat={lat} long={long} />
    </MapContainer>
  );
};

export default RenderMap;
