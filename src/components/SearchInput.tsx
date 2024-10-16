import { FC, useState } from "react";
import { IoSearch } from "react-icons/io5";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

interface IProps {
  setLat: (value: number) => void;
  setLong: (value: number) => void;
}

const SearchInput: FC<IProps> = ({ setLat, setLong }) => {
  const [address, setAddress] = useState("");
  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setLat(latLng.lat);
        setLong(latLng.lng);
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <div className="fixed top-[80px] left-0 z-[9999] flex items-center">
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <div className="relative flex items-center">
              <input
                {...getInputProps({
                  className:
                    "py-2 pl-4 pr-8 focus:outline-none rounded-md min-w-[300px]",
                  placeholder: "Search Address",
                })}
              />
              <IoSearch className="absolute right-2" />
            </div>

            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
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
                    <div className="px-4 py-2">{suggestion.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default SearchInput;
