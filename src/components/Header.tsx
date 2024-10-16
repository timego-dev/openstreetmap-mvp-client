const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-[9999] px-4 h-[80px] flex bg-white w-full gap-10 items-center">
      <div className="text-blue-500 font-semibold text-xl">OpenStreetMap MVP</div>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Saved Address
      </button>
    </div>
  );
};

export default Header;
