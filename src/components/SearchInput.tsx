import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import agent from "../config/agent";
import * as _ from "lodash";
import { toast } from "react-toastify";
import { IAddress } from "../@types/Address";

interface IProps {
  setLat: (value: number) => void;
  setLong: (value: number) => void;
  setPage: (value: number) => void;
  setTotal: (value: number) => void;
  setShowHistory: (value: boolean) => void;
  setSavedAddress: (value: IAddress[]) => void;
  savedAddress: IAddress[];
  showHistory: boolean;
  lat: number;
  long: number;
  page: number;
  total: number;
}

const SearchInput: FC<IProps> = ({
  setLat,
  setLong,
  setSavedAddress,
  setShowHistory,
  lat,
  long,
  savedAddress,
  showHistory,
  page,
  setPage,
  setTotal,
  total,
}) => {
  const [address, setAddress] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (displayResult) {
      setShowHistory(false);
    }
  }, [displayResult, setShowHistory]);

  useEffect(() => {
    if (showHistory) {
      setDisplayResult(false);
    } else {
      setPage(1);
    }
  }, [setPage, showHistory]);

  const debounceSaved = _.debounce(async () => {
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
  }, 200);

  const handleSaveAddress = useCallback(() => debounceSaved(), [debounceSaved]);

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

  const handleClichHistory = (item: IAddress) => {
    setAddress(item.name);
    setLat(item.lat);
    setLong(item.long);
  };

  const debounceFetch = _.debounce(async () => {
    try {
      const result = await agent.get(`/history?page=${page + 1}`);
      setSavedAddress([...savedAddress, ...result.data.data]);
      setTotal(result.data.total);
      setPage(page + 1);
      setShowHistory(true);
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  }, 200);

  const handleFetchHistory = useCallback(
    () => debounceFetch(),
    [debounceFetch]
  );

  return (
    <div className="fixed px-4 md:px-0 top-[90px] flex justify-center flex-col items-center md:justify-start md:items-start w-full md:left-4 z-[9999]">
      <PlacesAutocomplete
        value={address}
        onChange={(value) => {
          setDisplayResult(false);
          setShowHistory(false);
          setAddress(value);
        }}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="w-full">
            <div className="relative flex items-center w-full">
              <input
                {...getInputProps({
                  className:
                    "py-2 pl-4 pr-8 focus:outline-none rounded-md w-full md:w-[350px]",
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
                      className="px-4 py-2 w-full md:w-[350px] truncate"
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
        <div className="bg-white p-4 w-full md:w-[350px] mt-4 rounded-md">
          <div className="text-xl font-semibold">Search result</div>
          {notFound ? (
            "No result found"
          ) : (
            <Fragment>
              <div>
                {address} ({lat} - {long})
              </div>
              <div className="mt-4 flex justify-center w-full">
                <button
                  disabled={loading}
                  onClick={handleSaveAddress}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save Address
                </button>
              </div>
            </Fragment>
          )}
        </div>
      ) : null}

      {showHistory ? (
        <div className="bg-white px-4 py-2 w-full md:w-[350px] mt-4 rounded-md relative">
          <div className="text-xl font-semibold mb-2">Saved Address</div>
          <IoCloseOutline
            className="absolute top-2 right-2 text-xl cursor-pointer"
            onClick={() => {
              setShowHistory(false);
            }}
          />
          <div
            style={{ maxHeight: "calc(100vh - 300px)" }}
            className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto"
          >
            {savedAddress.map((item) => (
              <div
                onClick={() => handleClichHistory(item)}
                key={item.timestamp.toString()}
                title={item.name}
                className="text-left w-[320px] hover:underline text-blue-500 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
            {page < total ? (
              <div
                className="text-center w-[320px] hover:underline text-blue-500 cursor-pointer"
                onClick={handleFetchHistory}
              >
                More ...
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchInput;
