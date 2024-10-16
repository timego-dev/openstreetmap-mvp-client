import { useEffect, useState } from "react";
import Map from "./components/Map";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";

function App() {
  const [lat, setLat] = useState<number>(51);
  const [long, setLong] = useState<number>(19);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((result) => {
      setLat(result.coords.latitude);
      setLong(result.coords.longitude);
    });
  }, []);

  return (
    <div className="relative" style={{ width: "100vw", height: "100vh" }}>
      <Header />
      <SearchInput setLat={setLat} setLong={setLong} />
      <Map lat={lat} long={long} />
    </div>
  );
}

export default App;
