/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Map from "./components/Map";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IAddress } from "./@types/Address";

function App() {
  const [lat, setLat] = useState<number>(51);
  const [long, setLong] = useState<number>(19);
  const [getSearchParams, setSearchParams] = useSearchParams();
  const [savedAddress, setSavedAdress] = useState<IAddress[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    const currentLat = getSearchParams.get("lat");
    const currentLong = getSearchParams.get("lng");
    if (currentLat && currentLong) {
      setLat(Number(currentLat));
      setLong(Number(currentLong));
    } else {
      navigator.geolocation.getCurrentPosition((result) => {
        setLat(result.coords.latitude);
        setLong(result.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    setSearchParams({ lat: lat.toString(), lng: long.toString() });
  }, [lat, long]);

  return (
    <div className="relative" style={{ width: "100vw", height: "100vh" }}>
      <Header
        setSavedAddress={setSavedAdress}
        setShowHistory={setShowHistory}
      />
      <SearchInput
        setLat={setLat}
        setLong={setLong}
        lat={lat}
        long={long}
        savedAddress={savedAddress}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />
      <Map lat={lat} long={long} />
      <ToastContainer />
    </div>
  );
}

export default App;
