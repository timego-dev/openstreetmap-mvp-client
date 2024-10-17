import { FC, useCallback, useState } from "react";
import { IoSearch } from "react-icons/io5";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import agent from "../config/agent";
import * as _ from "lodash";
import { toast } from "react-toastify";

interface IProps {
  setLat: (value: number) => void;
  setLong: (value: number) => void;
  lat: number;
  long: number;
}

const SearchInput: FC<IProps> = ({ setLat, setLong, lat, long }) => {
  const [address, setAddress] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveAddress = useCallback(
    _.debounce(async () => {
      setLoading(true);
      try {
        await agent.post("/history", {
          lat,
          long,
          name: address,
          timestamp: new Date(),
        });
        toast("Successfully saved address", { type: "success" });
      } catch (error: any) {
        toast(error.response.data.message, { type: "error" });
      } finally {
        setLoading(false);
      }
    }, 200),
    [lat, long, address]
  );

  const handleSelect = (address: string) => {
    setDisplayResult(false);
    setNotFound(false);
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(async (latLng) => {
        setDisplayResult(true);
        setLat(latLng.lat);
        setLong(latLng.lng);
      })
      .catch((error) => setNotFound(true));
  };

  return (
    <div className="fixed top-[90px] left-4 z-[9999]">
      <PlacesAutocomplete
        value={address}
        onChange={(value) => {
          setDisplayResult(false);
          setAddress(value);
        }}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <div className="relative flex items-center">
              <input
                {...getInputProps({
                  className:
                    "py-2 pl-4 pr-8 focus:outline-none rounded-md w-[350px]",
                  placeholder: "Search Address",
                })}
              />
              <IoSearch className="absolute right-2" />
            </div>

            <div className="autocomplete-dropdown-container">
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <div
                      className="px-4 py-2 w-[350px] truncate"
                      title={suggestion.description}
                    >
                      {suggestion.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      {displayResult ? (
        <div className="bg-white p-4 w-[350px]">
          <div className="text-xl font-semibold">Search result</div>
          {notFound ? "No result found" : <div>{address}</div>}
          <div className="mt-2 flex justify-center w-full">
            <button
              disabled={loading}
              onClick={handleSaveAddress}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Save Address
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchInput;
