import Sidebar from "../../Component/sidebar/index.jsx";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../Component/ProductItem/index.jsx";
import Button from "@mui/material/Button";
import { BsFillGridFill } from "react-icons/bs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useContext } from "react";
import Pagination from "@mui/material/Pagination";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoClose, IoOptionsOutline } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import { postData } from "../../utils/api.js";
import { myContext } from "../../App.jsx";
import { useLocation } from "react-router-dom";

export default function Productlisting() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setproductData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [page, setpage] = useState(1);
  const [Totalpage, setTotalpage] = useState(1);
  const [sort, setSort] = useState("Name A-Z");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const open = Boolean(anchorEl);
  const context = useContext(myContext);
  const location = useLocation();
  const selectedBrandId = new URLSearchParams(location.search).get("brandId");
  const selectedBrand = context.brandData?.find(
    (brand) => brand._id === selectedBrandId
  );

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
      setAnchorEl(null);
    });
  };

  return (
    <section className="min-h-screen bg-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-7">
          <Breadcrumbs
            separator="/"
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                color: "#9CA3AF",
              },
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="!text-sm !font-medium !text-gray-500 hover:!text-[#8B0000]"
            >
              Home
            </Link>

            {productData[0]?.category?.name ? (
              <Link
                underline="hover"
                color="inherit"
                href={`/products?catId=${productData[0]?.category?._id}`}
                className="!text-sm !font-semibold !text-[#0F1F4B]"
              >
                {productData[0]?.category?.name}
              </Link>
            ) : selectedBrand ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1F4B",
                }}
              >
                {selectedBrand.name}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1F4B",
                }}
              >
                {selectedBrand?.name || "All Products"}
              </Typography>
            )}
          </Breadcrumbs>
        </div>

        <div className="flex flex-col gap-7 lg:flex-row">
          {/* Sidebar */}
          <aside className="hidden w-full shrink-0 lg:block lg:w-[250px]">
            <div className="sticky top-5 rounded-xl border border-gray-200 bg-white p-5">
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
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            {/* Page heading */}
            <div className="mb-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[2px] text-[#8B0000]">
                    AGCELL COLLECTION
                  </span>

                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0F1F4B] sm:text-3xl">
                    {selectedBrand?.name || "All Products"}
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    {selectedBrand
                      ? `Explore products from ${selectedBrand.name}.`
                      : "Explore our collection and find the right product for you."}
                  </p>
                </div>

                <div className="text-sm font-medium text-gray-500">
                  <span className="font-bold text-[#0F1F4B]">
                    {productData?.length || 0}
                  </span>{" "}
                  Products
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-4">
              <div>
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  startIcon={<IoOptionsOutline />}
                  className="lg:!hidden"
                  sx={{
                    minHeight: 36,
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: "#0F1F4B",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Filters
                </Button>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span className="hidden text-sm font-medium text-gray-500 sm:block">
                  Sort by:
                </span>

                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  endIcon={
                    open ? <FaAngleUp size={13} /> : <FaAngleDown size={13} />
                  }
                  sx={{
                    color: "#0F1F4B",
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "7px 13px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#fff",
                      borderColor: "#0F1F4B",
                      boxShadow: "none",
                    },
                  }}
                >
                  {sort}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 190,
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {[
                    ["name", "asc", "Name A-Z"],
                    ["name", "desc", "Name Z-A"],
                    ["price", "asc", "Price Low to High"],
                    ["price", "desc", "Price High to Low"],
                  ].map(([name, order, label]) => (
                    <MenuItem
                      key={label}
                      onClick={() =>
                        handleSortBy(name, order, productData, label)
                      }
                      sx={{
                        fontSize: "13px",
                        color: sort === label ? "#8B0000" : "#374151",
                        fontWeight: sort === label ? 700 : 500,
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                        },
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            {/* Products */}
            {productData?.length > 0 ? (
              <div className="product-list-grid grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {productData.map((item, index) => (
                  <ProductItem key={item._id || index} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-5 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 text-[#0F1F4B]">
                  <BsFillGridFill size={24} />
                </div>

                <h3 className="text-lg font-bold text-[#0F1F4B]">
                  No products found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  We couldn't find any products here. Try changing your filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex justify-center border-t border-gray-100 pt-6">
              <Pagination
                count={Totalpage}
                color="primary"
                showFirstButton
                showNextButton
                hidePrevButton
                page={page}
                onChange={(e, page) => {
                  setpage(page);
                }}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#0F1F4B",
                    fontWeight: 600,
                    borderRadius: "8px",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#0F1F4B !important",
                    color: "#fff !important",
                  },
                }}
              />
            </div>
          </main>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{ sx: { width: "min(90vw, 360px)" } }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-bold text-[#0F1F4B]">Product filters</h2>
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
    </section>
  );
}
