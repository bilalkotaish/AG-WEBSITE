import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import { useState, useEffect, useContext } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { myContext } from "../../App";
import { useLocation } from "react-router-dom";
import { postData } from "../../utils/api";

export default function Sidebar(props) {
  const [isOpen, setIsopened] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);

  const [filters, setfilters] = useState({
    catId: [],
    brandIds: [],
    subcatId: [],
    thirdsubcatId: [],
    minPrice: "",
    maxPrice: "",
    rating: [],
    page: 1,
    limit: 5,
  });

  const [PriceRange, setPriceRange] = useState([0, 10000]);

  const context = useContext(myContext);
  const location = useLocation();

  const handleclick = () => {
    setIsopened(!isOpen);
  };

  const handlechangecheckbox = (field, value) => {
    context.setSearchData([]);

    const currentValue = filters[field] || [];

    const updatedValue = currentValue.includes(value)
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];

    let newFilters = { ...filters, [field]: updatedValue };

    if (field === "catId") {
      newFilters.subcatId = [];
      newFilters.thirdsubcatId = [];
    }

    if (field === "subcatId") {
      newFilters.thirdsubcatId = [];
    }

    setfilters(newFilters);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const updatedFilters = {
      catId: [],
      brandIds: [],
      subcatId: [],
      thirdsubcatId: [],
      rating: [],
      page: 1,
    };

    if (params.has("catId")) {
      updatedFilters.catId = [params.get("catId")];
    }
    if (params.has("brandId")) {
      updatedFilters.brandIds = [params.get("brandId")];
    }
    if (params.has("subcatId")) {
      updatedFilters.subcatId = [params.get("subcatId")];
    }
    if (params.has("thirdsubcatId")) {
      updatedFilters.thirdsubcatId = [params.get("thirdsubcatId")];
    }
    if (params.has("rating")) {
      updatedFilters.rating = params.get("rating").split(",").map(Number);
    }

    setfilters((prev) => ({
      ...prev,
      ...updatedFilters,
    }));
  }, [location]);

  useEffect(() => {
    props.setisLoading(true);

    if (context.searchData?.length > 0) {
      props.setproductData(context.searchData);
      props.setisLoading(false);
    } else {
      postData("/api/product/filters", filters).then((res) => {
        props.setproductData(res.data);
        props.setisLoading(false);
        props.setTotalpage(res.totalPages);
      });
    }
  }, [filters, context.searchData]);

  useEffect(() => {
    setfilters((prev) => ({
      ...prev,
      minPrice: PriceRange[0],
      maxPrice: PriceRange[1],
    }));
  }, [PriceRange]);

  useEffect(() => {
    setfilters((prev) => ({
      ...prev,
      page: props.page,
    }));
  }, [props.page]);

  return (
    <aside className="w-full bg-white">
      {/* Sidebar heading */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-[#0F1F4B]">
            Filters
          </h2>

          <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B0000] border border-[#8B0000]/20">
            AgCell
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-400">Refine your product search</p>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <button
          type="button"
          onClick={handleclick}
          className="mb-4 flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-bold text-[#0F1F4B]">
            Shop By Category
          </span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#0F1F4B] hover:text-[#0F1F4B]">
            {isOpen ? <FaAngleUp size={13} /> : <FaAngleDown size={13} />}
          </span>
        </button>

        <Collapse isOpened={isOpen}>
          <div className="flex flex-col gap-1">
            {context.catData.map((item) => (
              <FormControlLabel
                key={item._id}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.catId.includes(item._id)}
                    onChange={() => handlechangecheckbox("catId", item._id)}
                    sx={{
                      padding: "5px",
                      color: "#D1D5DB",
                      "&.Mui-checked": {
                        color: "#8B0000",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(139,0,0,0.04)",
                      },
                    }}
                  />
                }
                label={
                  <span
                    className={`text-[13px] transition-colors ${
                      filters.catId.includes(item._id)
                        ? "font-semibold text-[#0F1F4B]"
                        : "text-gray-500 hover:text-[#0F1F4B]"
                    }`}
                  >
                    {item.name}
                  </span>
                }
                className="!m-0 w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    width: "100%",
                  },
                }}
              />
            ))}
          </div>
        </Collapse>
      </div>

      {context.brandData?.length > 0 && (
        <div className="mb-8 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => setIsBrandsOpen((open) => !open)}
            className="mb-4 flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-bold text-[#0F1F4B]">
              Shop By Brand
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500">
              {isBrandsOpen ? <FaAngleUp size={13} /> : <FaAngleDown size={13} />}
            </span>
          </button>
          <Collapse isOpened={isBrandsOpen}>
            <div className="flex flex-col gap-1">
              {context.brandData.map((brand) => (
                <FormControlLabel
                  key={brand._id}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.brandIds.includes(brand._id)}
                      onChange={() => handlechangecheckbox("brandIds", brand._id)}
                      sx={{
                        padding: "5px",
                        color: "#D1D5DB",
                        "&.Mui-checked": { color: "#8B0000" },
                      }}
                    />
                  }
                  label={
                    <span className="flex min-w-0 items-center gap-2 text-[13px] text-gray-600">
                      <img
                        src={brand.image?.url}
                        alt=""
                        loading="lazy"
                        className="h-7 w-9 rounded border border-gray-100 bg-white object-contain p-0.5"
                      />
                      <span className="truncate">{brand.name}</span>
                    </span>
                  }
                  className="!m-0 w-full"
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* Price filter */}
      <div className="border-t border-gray-100 pt-6">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-[#0F1F4B]">Filter By Price</h3>

          <p className="mt-1 text-xs text-gray-400">
            Select your preferred price range
          </p>
        </div>

        <div className="px-1">
          <RangeSlider
            min={0}
            max={10000}
            onInput={setPriceRange}
            step={10}
            value={PriceRange}
          />
        </div>

        {/* Price values */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Minimum
            </span>

            <span className="text-sm font-bold text-[#0F1F4B]">
              ${PriceRange[0].toLocaleString()}
            </span>
          </div>

          <span className="text-xs text-gray-400">—</span>

          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Maximum
            </span>

            <span className="text-sm font-bold text-[#0F1F4B]">
              ${PriceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Rating filter - original functionality preserved as commented code */}
      {/*
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="mb-4 text-sm font-bold text-[#0F1F4B]">
          Filter By Rating
        </h3>

        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.rating.includes(star)}
                    onChange={() =>
                      handlechangecheckbox("rating", star)
                    }
                    sx={{
                      color: "#D1D5DB",
                      "&.Mui-checked": {
                        color: "#8B0000",
                      },
                    }}
                  />
                }
                label={
                  <Rating
                    value={star}
                    readOnly
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#F5A623",
                      },
                    }}
                  />
                }
                className="!m-0"
              />
            </div>
          ))}
        </div>
      </div>
      */}
    </aside>
  );
}
