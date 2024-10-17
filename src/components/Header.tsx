import { FC, useCallback } from "react";
import { IAddress } from "../@types/Address";
import LogoImage from "../assets/icon/logo.png";
import { debounce, orderBy } from "lodash";
import agent from "../config/agent";

interface IProps {
  setSavedAddress: (value: IAddress[]) => void;
  setShowHistory: (value: boolean) => void;
  page: number;
  setTotal: (value: number) => void;
}

const Header: FC<IProps> = ({
  setSavedAddress,
  setShowHistory,
  page,
  setTotal,
}) => {
  const debounceFetch = debounce(async () => {
    try {
      const result = await agent.get(`/history?page=${page}`);
      setSavedAddress(orderBy(result.data.data, "timestamp", "desc"));
      setTotal(result.data.total);
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
    <div className="fixed top-0 left-0 z-[9999] px-4 h-[80px] flex bg-white w-full gap-10 items-center">
      <div className="flex items-center gap-2">
        <img src={LogoImage} alt="" className="w-[32px] h-[32px]" />
        <div className="text-blue-500 font-semibold md:text-xl  text-md">
          <div>OpenStreetMap MVP</div>
        </div>
      </div>

      <div
        onClick={handleFetchHistory}
        className="block text-blue-700 cursor-pointer text-sm md:text-lg"
      >
        Saved Address
      </div>
    </div>
  );
};

export default Header;
