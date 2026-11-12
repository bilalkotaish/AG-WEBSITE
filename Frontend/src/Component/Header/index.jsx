import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { FaBars, FaRegUser, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsBagCheck } from "react-icons/bs";
import { GoChecklist } from "react-icons/go";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { PiMinusSquareLight } from "react-icons/pi";
import { VscDiffAdded } from "react-icons/vsc";
import { IoHomeOutline } from "react-icons/io5";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

import { myContext } from "../../App";
import { fetchData } from "../../utils/api";

import Search from "../Search";
import Logo from "../Logo";
import "./style.css";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    right: -4,
    top: 4,
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    border: "2px solid #ffffff",
    backgroundColor: "#8B0000",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 700,
  },
}));

export default function Header() {
  const context = useContext(myContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catData, setCatData] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [subInnerMenuIndex, setSubInnerMenuIndex] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (context?.catData) {
      setCatData(context.catData);
    }
  }, [context?.catData]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleCategoryPanel = () => {
    setShowCategories((prev) => !prev);
    setSubmenuIndex(null);
    setSubInnerMenuIndex(null);
  };

  const toggleSubmenu = (index) => {
    setSubmenuIndex((prev) => (prev === index ? null : index));
    setSubInnerMenuIndex(null);
  };

  const toggleInnerSubmenu = (index) => {
    setSubInnerMenuIndex((prev) => (prev === index ? null : index));
  };

  const logout = () => {
    setAnchorEl(null);

    fetchData(`/api/user/Logout?token=${localStorage.getItem("accesstoken")}`, {
      withCredentials: true,
    }).then((res) => {
      if (res.error === false) {
        context.setislogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        context.setCatData([]);
        context.setCartData([]);
        context.setListData([]);
        navigate("/");
      } else {
        context.setislogin(true);
      }
    });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const mobileNavItems = [
    { label: "Home", to: "/", icon: <IoHomeOutline className="text-xl" /> },
    {
      label: "Wishlist",
      to: "/mylist",
      icon: <FaRegHeart className="text-xl" />,
    },
    {
      label: "Cart",
      to: "/Cart",
      icon: <MdOutlineShoppingCart className="text-xl" />,
    },
    {
      label: "Orders",
      to: context?.islogin ? "/myorders" : "/login",
      icon: <GoChecklist className="text-xl" />,
    },
    {
      label: "Account",
      to: context?.islogin ? "/myaccount" : "/login",
      icon: <FaRegUser className="text-xl" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white">
        {/* Top Announcement Bar */}

        <div className="overflow-hidden bg-[#0F1F4B] text-white">
          {/* Mobile: infinite scrolling messages */}
          <div className="flex h-[34px] items-center overflow-hidden sm:hidden">
            <div className="flex w-max animate-header-marquee whitespace-nowrap">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex shrink-0 items-center gap-12 px-4 text-[10px] font-medium tracking-wide"
                >
                  <span className="font-semibold text-[#E31E24]">
                    ✓ Trust & Security
                  </span>

                  <span>Delivery across Lebanon in 1–3 business days</span>

                  <span className="font-semibold text-[#E31E24]">
                    Free delivery on first orders above $50
                  </span>

                  <Link
                    to="/contactus"
                    className="font-semibold text-white hover:text-[#E31E24]"
                  >
                    Need Help?
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: normal static header */}
          <div className="container mx-auto hidden h-[36px] items-center justify-between gap-4 px-4 text-xs sm:flex">
            <p className="whitespace-nowrap font-semibold tracking-wide text-[#E31E24]">
              ✓ Trust & Security
            </p>

            <p className="text-center font-medium tracking-wide text-white/90">
              Delivery across Lebanon in 1–3 business days. Free delivery on
              first orders above $50.
            </p>

            <Link
              to="/contactus"
              className="whitespace-nowrap font-semibold text-white/80 transition hover:text-[#E31E24]"
            >
              Need Help?
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="site-header-main container mx-auto flex min-h-[76px] items-center gap-3 px-4 lg:gap-7">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleDrawer(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5 lg:hidden"
            >
              <FaBars />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="site-header-logo shrink-0"
              aria-label="AgCell home"
            >
              <Logo className="h-10 w-auto sm:h-11" />
            </Link>

            {/* Desktop Search */}
            <div className="mx-auto hidden w-full max-w-[560px] flex-1 md:block">
              <Search />
            </div>

            {/* Header Actions */}
            <div className="site-header-actions ml-auto hidden shrink-0 items-center gap-1 sm:gap-2 md:flex">
              {/* Account */}
              {context?.islogin ? (
                <>
                  <Tooltip title="My Account">
                    <IconButton
                      onClick={handleClick}
                      aria-label="Open account menu"
                      sx={{
                        color: "#0F1F4B",
                        width: 42,
                        height: 42,
                        "&:hover": {
                          backgroundColor: "rgba(15,31,75,0.06)",
                        },
                      }}
                    >
                      <FaRegUser className="text-[19px]" />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          mt: 1.5,
                          minWidth: 190,
                          border: "1px solid #eeeeee",
                          borderRadius: "10px",
                          overflow: "visible",
                          boxShadow: "0 8px 30px rgba(15,31,75,0.12)",
                          "& .MuiMenuItem-root": {
                            fontSize: "13px",
                            padding: "11px 16px",
                            color: "#374151",
                            gap: "10px",
                            "&:hover": {
                              backgroundColor: "rgba(15,31,75,0.05)",
                              color: "#0F1F4B",
                            },
                          },
                        },
                      },
                    }}
                    transformOrigin={{
                      horizontal: "right",
                      vertical: "top",
                    }}
                    anchorOrigin={{
                      horizontal: "right",
                      vertical: "bottom",
                    }}
                  >
                    <Link to="/myaccount" onClick={handleClose}>
                      <MenuItem>
                        <FaRegUser />
                        My Account
                      </MenuItem>
                    </Link>

                    <Link to="/myorders" onClick={handleClose}>
                      <MenuItem>
                        <BsBagCheck />
                        My Orders
                      </MenuItem>
                    </Link>

                    <Link to="/myList" onClick={handleClose}>
                      <MenuItem>
                        <GoChecklist />
                        My Wishlist
                      </MenuItem>
                    </Link>

                    <MenuItem onClick={logout}>
                      <RiLogoutBoxLine className="text-[#8B0000]" />
                      <span className="text-[#8B0000]">Logout</span>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Tooltip title="Login">
                  <Link
                    to="/login"
                    aria-label="Login"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5"
                  >
                    <FaRegUser className="text-[19px]" />
                  </Link>
                </Tooltip>
              )}

              {/* Cart */}
              <Tooltip title="Shopping Cart">
                <IconButton
                  onClick={() => context.setopenCartPanel(true)}
                  aria-label="Open shopping cart"
                  sx={{
                    color: "#0F1F4B",
                    width: 42,
                    height: 42,
                    "&:hover": {
                      backgroundColor: "rgba(15,31,75,0.06)",
                    },
                  }}
                >
                  <StyledBadge badgeContent={context?.cartData?.length || 0}>
                    <MdOutlineShoppingCart className="text-[23px]" />
                  </StyledBadge>
                </IconButton>
              </Tooltip>

              {/* Wishlist */}
              <Tooltip title="Wishlist">
                <Link to="/myList" aria-label="My wishlist">
                  <IconButton
                    sx={{
                      color: "#0F1F4B",
                      width: 42,
                      height: 42,
                      "&:hover": {
                        backgroundColor: "rgba(15,31,75,0.06)",
                      },
                    }}
                  >
                    <StyledBadge badgeContent={context?.listData?.length || 0}>
                      <FaRegHeart className="text-[20px]" />
                    </StyledBadge>
                  </IconButton>
                </Link>
              </Tooltip>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden border-t border-gray-100 lg:block">
            <div className="container mx-auto flex items-center justify-center gap-10 px-4 py-3">
              <Link
                to="/products"
                className="text-sm font-semibold text-[#0F1F4B] transition hover:text-[#8B0000]"
              >
                All Products
              </Link>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true);
                  setShowCategories(true);
                }}
                className="text-sm font-semibold text-[#0F1F4B] transition hover:text-[#8B0000]"
              >
                Categories
              </button>

              <Link
                to="/aboutus"
                className="text-sm font-semibold text-[#0F1F4B] transition hover:text-[#8B0000]"
              >
                About Us
              </Link>

              <Link
                to="/contactus"
                className="text-sm font-semibold text-[#0F1F4B] transition hover:text-[#8B0000]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: { xs: "85%", sm: 340 },
              maxWidth: "360px",
              backgroundColor: "#ffffff",
            },
          }}
        >
          <div className="flex h-full flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
              <Link to="/" onClick={closeDrawer}>
                <Logo className="h-10 w-auto" />
              </Link>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#0F1F4B] transition hover:bg-gray-100"
              >
                <IoMdClose />
              </button>
            </div>

            {/* Drawer Search */}
            <div className="border-b border-gray-100 p-4 md:hidden">
              <Search />
            </div>

            {/* Drawer Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <Link
                to="/products"
                onClick={closeDrawer}
                className="mb-1 flex items-center rounded-lg px-4 py-3 text-sm font-semibold text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5 hover:text-[#8B0000]"
              >
                All Products
              </Link>

              {/* Categories */}
              <button
                type="button"
                onClick={toggleCategoryPanel}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5"
              >
                Categories
                <span className="text-lg">
                  {showCategories ? <PiMinusSquareLight /> : <VscDiffAdded />}
                </span>
              </button>

              {showCategories && (
                <div className="mt-2 max-h-[55vh] overflow-y-auto rounded-lg border border-gray-100 bg-white">
                  <ul className="w-full">
                    {catData?.map((item, index) => (
                      <li
                        key={item._id || index}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center justify-between px-3 transition hover:bg-[#0F1F4B]/5">
                          <Link
                            to={`/products?catId=${item._id}`}
                            onClick={closeDrawer}
                            className="w-full py-3 text-sm font-medium text-gray-700 hover:text-[#8B0000]"
                          >
                            {item.name}
                          </Link>

                          {item.children?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleSubmenu(index)}
                              aria-label={`Toggle ${item.name} subcategories`}
                              className="flex h-9 w-9 items-center justify-center text-xl text-[#0F1F4B]"
                            >
                              {submenuIndex === index ? (
                                <PiMinusSquareLight />
                              ) : (
                                <VscDiffAdded />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            submenuIndex === index
                              ? "max-h-[1000px]"
                              : "max-h-0"
                          }`}
                        >
                          <ul className="bg-[#F8F9FC] px-3 py-1">
                            {item.children?.map((subcat, subIndex) => (
                              <li
                                key={subcat._id || subIndex}
                                className="border-b border-gray-100 last:border-0"
                              >
                                <div className="flex items-center justify-between">
                                  <Link
                                    to={`/products?subCatId=${subcat._id}`}
                                    onClick={closeDrawer}
                                    className="flex-1 py-3 pl-3 text-[13px] text-gray-600 transition hover:text-[#8B0000]"
                                  >
                                    {subcat.name}
                                  </Link>

                                  {subcat.children?.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleInnerSubmenu(subIndex)
                                      }
                                      aria-label={`Toggle ${subcat.name} subcategories`}
                                      className="flex h-9 w-9 items-center justify-center text-lg text-[#0F1F4B]"
                                    >
                                      {subInnerMenuIndex === subIndex ? (
                                        <PiMinusSquareLight />
                                      ) : (
                                        <VscDiffAdded />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {/* Third-level Categories */}
                                <div
                                  className={`overflow-hidden transition-all duration-300 ${
                                    subInnerMenuIndex === subIndex
                                      ? "max-h-[700px]"
                                      : "max-h-0"
                                  }`}
                                >
                                  <ul className="bg-white py-2 pl-7">
                                    {subcat.children?.map((third, i) => (
                                      <li key={third._id || i}>
                                        <Link
                                          to={`/category/${third._id}`}
                                          onClick={closeDrawer}
                                          className="block py-2 text-[13px] text-gray-500 transition hover:text-[#8B0000]"
                                        >
                                          {third.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                to="/aboutus"
                onClick={closeDrawer}
                className="mt-1 flex items-center rounded-lg px-4 py-3 text-sm font-semibold text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5 hover:text-[#8B0000]"
              >
                About Us
              </Link>

              <Link
                to="/contactus"
                onClick={closeDrawer}
                className="flex items-center rounded-lg px-4 py-3 text-sm font-semibold text-[#0F1F4B] transition hover:bg-[#0F1F4B]/5 hover:text-[#8B0000]"
              >
                Contact Us
              </Link>
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <p className="text-center text-xs text-gray-400">
                AgCell · Delivery across Lebanon
              </p>
            </div>
          </div>
        </Drawer>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white/95 shadow-[0_-6px_24px_rgba(15,31,75,0.08)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 text-[10px] font-semibold text-[#0F1F4B] transition hover:text-[#8B0000]"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
