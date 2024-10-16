const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-[9999] px-4 h-[80px] flex bg-white w-full gap-10 items-center">
      <div className="text-blue-500 font-semibold text-xl">
        OpenStreetMap MVP
      </div>
      <div className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 cursor-pointer">
        Saved Address
      </div>
    </div>
  );
};

export default Header;
