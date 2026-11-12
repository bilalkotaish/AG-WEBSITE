import Sidebar from "../../Component/sidebar/index.jsx";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../Component/ProductItem/index.jsx";
import Button from "@mui/material/Button";
import { BsFillGridFill } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { IoClose, IoOptionsOutline } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import { postData } from "../../utils/api.js";
import { myContext } from "../../App.jsx";

export default function SearchPage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [ItemView, SetItemView] = useState("grid");
  const [productData, setproductData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [page, setpage] = useState(1);
  const [Totalpage, setTotalpage] = useState(1);
  const [sort, setSort] = useState("Name A-Z");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const context = useContext(myContext);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSortBy = (name, order, products, value) => {
    setSort(value);

    const plainArray = Array.isArray(products) ? products : products?.products;

    postData("/api/product/Sort", {
      products: plainArray,
      sortBy: name,
      order: order,
    }).then((res) => {
      console.log(res);
      setproductData(res.data);
      context.setSearchData(res.data);
      setAnchorEl(null);
    });
  };

  return (
    <section className="py-8">
      <div className="container">
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" className="link">
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              // to={`/products?catId=${item._id}`}
              className="link"
            >
              Fashion
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <div className="bg-white p-2 mt-3 ">
        <div className="container search-results-layout flex flex-col gap-3 lg:flex-row">
          <div className="sidebarwrapper hidden shrink-0 bg-white p-3 lg:block lg:w-[250px]">
            <Sidebar
              productData={productData}
              setproductData={setproductData}
              isLoading={isLoading}
              setisLoading={setisLoading}
              page={page}
              setpage={setpage}
              Totalpage={Totalpage}
              setTotalpage={setTotalpage}
            />
          </div>
          <div className="rightcontent min-w-0 w-full flex-1 py-3">
            <div className="p-2 w-full sticky top-0 right-0 z-10 bg-[#f1f1f1] mb-4 rounded-md flex flex-wrap items-center justify-between gap-2">
              <div className="col-1 flex min-w-0 flex-wrap items-center gap-0 itemViewActions">
                <Button
                  className={`!w-[40px] !h-[40px] !rounded-full !text-black ${
                    ItemView === "list" && "active"
                  }`}
                  onClick={() => {
                    SetItemView("list");
                  }}
                >
                  <IoMdMenu />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !rounded-full !text-black  ${
                    ItemView === "grid" && "active"
                  }`}
                  onClick={() => {
                    SetItemView("grid");
                  }}
                >
                  <BsFillGridFill />
                </Button>
                <span className="text-[14px] font-[400] text-[rgba(0,0,0,0.5)]">
                  {" "}
                  There are {productData?.length} products Available{" "}
                </span>
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  startIcon={<IoOptionsOutline />}
                  className="!ml-2 !border !border-gray-300 !text-[#0F1F4B] !normal-case lg:!hidden"
                  aria-label="Open product filters"
                >
                  Filters
                </Button>
              </div>

              <div className="col-2 ml-auto flex items-center justify-end gap-2">
                <span className="text-sm font-semibold text-gray-500">
                  Sort by
                </span>

                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!text-sm !text-gray-800 !bg-white !capitalize !border !border-gray-300 !shadow-sm hover:!bg-gray-100"
                  endIcon={open ? <FaAngleUp /> : <FaAngleDown />}
                >
                  {sort}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    className: "!bg-white !shadow-lg !rounded-md",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleSortBy("name", "asc", productData, "Name A-Z");
                    }}
                    className="!text-sm !text-gray-800 hover:!bg-gray-100"
                  >
                    Name A-Z
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleSortBy("name", "desc", productData, "Name Z-A");
                    }}
                    className="!text-sm !text-gray-800 hover:!bg-gray-100"
                  >
                    Name Z-A
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleSortBy(
                        "price",
                        "asc",
                        productData,
                        "Price Low to High",
                      );
                    }}
                    className="!text-sm !text-gray-800 hover:!bg-gray-100"
                  >
                    Price Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleSortBy(
                        "price",
                        "desc",
                        productData,
                        "Price High to Low",
                      );
                    }}
                    className="!text-sm !text-gray-800 hover:!bg-gray-100"
                  >
                    Price High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <Pagination
              className="flex justify-center mt-3 items-center"
              count={Totalpage}
              color="primary"
              showFirstButton
              showNextButton
              hidePrevButton
              page={page}
              onChange={(e, page) => {
                setpage(page);
              }}
            />
          </div>
          <Drawer
            anchor="right"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            PaperProps={{ sx: { width: "min(90vw, 360px)" } }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-lg font-bold text-[#0F1F4B]">
                  Product filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#0F1F4B] hover:bg-gray-100"
                >
                  <IoClose />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <Sidebar
                  productData={productData}
                  setproductData={setproductData}
                  isLoading={isLoading}
                  setisLoading={setisLoading}
                  page={page}
                  setpage={setpage}
                  Totalpage={Totalpage}
                  setTotalpage={setTotalpage}
                />
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </section>
  );
}
