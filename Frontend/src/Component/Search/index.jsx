import "./style.css";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { myContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [search, setSearch] = useState("");
  const context = useContext(myContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value !== "") {
      postData("/api/product/search", { query: value }).then((res) => {
        context.setSearchData(res.data);
        console.log(res.data);
      });
    } else {
      context.setSearchData([]);
    }
  };

  const handleSearch = () => {
    navigate(`/search`);
    setSearch("");
    context.setSearchData([]);
  };

  return (
    <div className="searchbox w-full h-11 bg-[#f4f4f5] rounded-full relative border border-black/10">
      <input
        value={search}
        onChange={onChangeInput}
        className="w-full h-11 focus:outline-none !text-black bg-transparent rounded-full px-4 pr-12 text-sm placeholder:text-gray-500"
        placeholder="Search phones, brands, accessories..."
        type="text"
      />

      <Button
        onClick={handleSearch}
        className="!absolute top-[4px] right-[4px] !text-black z-50 !w-9 !min-w-9 !h-9 !rounded-full"
      >
        <IoSearch className="text-primary text-[20px]" />
      </Button>

      {/* Search Results Dropdown */}
      {search && context?.searchData?.length > 0 && (
        <div className="absolute top-[55px] left-0 w-full bg-white shadow-lg rounded-md z-40 max-h-[300px] overflow-y-auto">
          {context.searchData.map((item, index) => (
            <div
              key={index}
              className="p-3 border-b hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                navigate(`/productDetails/${item._id}`);
                setSearch("");
                context.setSearchData([]);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
