import Button from "@mui/material/Button";
import { RiMenu3Fill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import { FaRegBell } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiActivity } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";
import { Divider } from "@mui/material";
import { Mycontext } from "../../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchData, patchData } from "../../utils/api";
import Addproduct from "../../Pages/Products/Addproducts";
import AddHomeSlider from "../../Pages/HomeSliderbanner/Addhomeslider";
import AddCategory from "../../Pages/Category/addCategroy";
import AddSubCategory from "../../Pages/Category/addSubCategroy";
import Addadress from "../../Pages/Address/Addadress";
import EditCategory from "../../Pages/Category/editCategory";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import React from "react";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import EditProduct from "../../Pages/Products/editProduct";
import Addbannerv1 from "../../Pages/bannerv1/addbannerv1";
import Editbannerv1 from "../../Pages/bannerv1/editbannerv1";
import AddBlog from "../../Pages/Blog/addblog";
import EditBlog from "../../Pages/Blog/editBlog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Header() {
  const [anchormyacc, setAnchormyacc] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const seenNotificationIds = useRef(new Set());
  const openMyacc = Boolean(anchormyacc);
  const notificationsOpen = Boolean(notificationAnchor);
  const history = useNavigate();
  const handleClickMyacc = (event) => {
    setAnchormyacc(event.currentTarget);
  };
  const handleCloseMyacc = () => {
    setAnchormyacc(null);
  };
  const context = useContext(Mycontext);
  const { isLogin, Alertbox } = context;
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 4px",
    },
  }));
  const logout = () => {
    setAnchormyacc(null);
    fetchData(`/api/user/Logout?token=${localStorage.getItem("accesstoken")}`, {
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.error === false) {
        context.setisLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        history("/");
      } else {
        context.setisLogin(true);
      }
    });
  };

  useEffect(() => {
    if (!isLogin) {
      setNotifications([]);
      setUnreadNotifications(0);
      seenNotificationIds.current.clear();
      return undefined;
    }

    let active = true;
    let isInitialLoad = true;
    const loadNotifications = async () => {
      const response = await fetchData("/api/admin/notifications");
      if (!active) return;
      if (response.error || !Array.isArray(response.notifications)) {
        console.error(
          "Could not load admin notifications:",
          response.message || "Invalid response"
        );
        return;
      }

      const freshNotifications = response.notifications.filter(
        (notification) =>
          notification.type === "new_order" &&
          !notification.readAt &&
          !seenNotificationIds.current.has(notification._id)
      );
      if (!isInitialLoad && freshNotifications.length > 0) {
        const latestOrder = freshNotifications[0].order;
        Alertbox(
          "success",
          `New order received${latestOrder?._id ? ` (#${latestOrder._id.slice(-6)})` : ""}`
        );
      }

      response.notifications.forEach((notification) =>
        seenNotificationIds.current.add(notification._id)
      );
      isInitialLoad = false;
      setNotifications(response.notifications);
      setUnreadNotifications(Number(response.unreadCount) || 0);
    };

    void loadNotifications();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadNotifications();
    }, 15000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void loadNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLogin, Alertbox]);

  const markNotificationRead = async (notification) => {
    setNotificationAnchor(null);
    if (!notification.readAt) {
      const response = await patchData(
        `/api/admin/notifications/${notification._id}/read`
      );
      if (response.error) {
        context.Alertbox("error", response.message || "Could not update notification");
        return;
      }
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      );
      setUnreadNotifications((count) => Math.max(0, count - 1));
    }
    history("/orders");
  };

  const markAllNotificationsRead = async () => {
    const response = await patchData("/api/admin/notifications/read-all");
    if (response.error) {
      context.Alertbox("error", response.message || "Could not update notifications");
      return;
    }
    const readAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, readAt }))
    );
    setUnreadNotifications(0);
  };

  const formatNotificationDate = (date) => {
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? ""
      : parsedDate.toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  };

  return (
    <>
      <header
        className={`admin-topbar sticky top-0 z-30 flex min-h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 py-2 pr-4 shadow-sm backdrop-blur transition-all duration-300 sm:pr-6 ${
          context.isSidebar === true ? "pl-64" : "pl-4"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button
            onClick={() => context.setisSidebar(!context.isSidebar)}
            aria-label={context.isSidebar ? "Close navigation menu" : "Open navigation menu"}
            className="!h-10 !w-10 !min-w-10 !rounded-xl !text-slate-600 hover:!bg-slate-100"
          >
            <RiMenu3Fill className="text-[18px]" />
          </Button>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B0000]">
              AgCell · Admin
            </p>
            <p className="truncate text-sm font-semibold text-slate-800">
              Store control center
            </p>
          </div>
        </div>

        <div className="part2 flex items-center !justify-end gap-2 sm:gap-4">
          <IconButton
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={notificationsOpen}
            onClick={(event) => setNotificationAnchor(event.currentTarget)}
          >
            <StyledBadge
              badgeContent={unreadNotifications}
              color="secondary"
              invisible={unreadNotifications === 0}
            >
              <FaRegBell />
            </StyledBadge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchor}
            open={notificationsOpen}
            onClose={() => setNotificationAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  width: "min(420px, calc(100vw - 24px))",
                  maxHeight: "min(600px, calc(100vh - 100px))",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  boxShadow: "0 16px 45px rgba(15, 31, 75, 0.18)",
                },
              },
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">
                  {unreadNotifications
                    ? `${unreadNotifications} unread`
                    : "You’re all caught up"}
                </p>
              </div>
              {unreadNotifications > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-[#8B0000] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[min(500px,calc(100vh-180px))] overflow-y-auto py-1">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  New orders will appear here.
                </p>
              ) : (
                notifications.map((notification) => {
                  const order = notification.order;
                  const customer = order?.userId;
                  const address = order?.deliver_address;
                  const firstProduct = order?.products?.[0];
                  const productName =
                    firstProduct?.productTitle?.name ||
                    firstProduct?.productId?.name ||
                    "Order";
                  const itemCount = (order?.products || []).reduce(
                    (total, product) => total + (Number(product.quantity) || 0),
                    0
                  );

                  return (
                    <MenuItem
                      key={notification._id}
                      onClick={() => markNotificationRead(notification)}
                      className={`!items-start !whitespace-normal !border-b !border-slate-50 !px-4 !py-3 ${
                        notification.readAt ? "" : "!bg-blue-50/60"
                      }`}
                    >
                      <span className="mr-3 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B0000]/10 text-[#8B0000]">
                        <FaRegBell />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="text-sm font-bold text-slate-800">
                            New order received
                          </span>
                          {!notification.readAt && (
                            <span
                              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B0000]"
                              aria-label="Unread"
                            />
                          )}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {customer?.name || "A customer"} ordered {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"} — {productName}
                          {itemCount > 1 ? " and more" : ""}.
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-[#0F1F4B]">
                          Total: ${Number(order?.Total || 0).toFixed(2)}
                          {address?.City ? ` · ${address.City}` : ""}
                        </span>
                        <span className="mt-1 block text-[10px] text-slate-400">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </span>
                    </MenuItem>
                  );
                })
              )}
            </div>
          </Menu>

          {context.isLogin === true ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Open account menu"
                className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100 transition hover:ring-[#8B0000]/30"
                onClick={handleClickMyacc}
              >
                {context.userData?.Avatar ? (
                  <img
                    src={context.userData.Avatar}
                    className="h-full w-full rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#0F1F4B] text-sm font-bold text-white">
                    {context.userData?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
              </button>

              <Menu
                anchorEl={anchormyacc}
                id="account-menu"
                open={openMyacc}
                onClose={handleCloseMyacc}
                onClick={handleCloseMyacc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMyacc}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnJ8ohO113eX3thYt_EViTew3NXN3xwKxi4DzqigRhpA0GY6OWlgY5yZCOqPLda4y5fk&usqp=CAU."
                        className="w-full h-full object-cover rounded-full"
                        onClick={handleClickMyacc}
                      />
                    </div>

                    <div className="info ">
                      <h3 className="!text-[16px] font-[500] ">
                        {context.userData?.name}
                      </h3>
                      <h3 className="!text-[13px] font-[400] opacity-70">
                        {context?.userData?.email}
                      </h3>
                    </div>
                  </div>
                </MenuItem>
                <Divider />
                <Link to="/profile">
                  <MenuItem
                    onClick={handleCloseMyacc}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser /> <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>

                <MenuItem onClick={logout} className="flex items-center gap-3">
                  <RiLogoutBoxLine />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className="!bg-blue-600 !text-white !rounded-full">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      <Dialog
        fullScreen
        open={context.isOpenPanel.open}
        onClose={() => context.setisOpenPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => context.setisOpenPanel({ open: false })}
              aria-label="close"
            >
              <IoMdClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {context.isOpenPanel?.model}
            </Typography>
          </Toolbar>
        </AppBar>
        {context.isOpenPanel.model === "Add Product" && <Addproduct />}
        {context.isOpenPanel.model === "AddBannerslider" && <AddHomeSlider />}
        {context.isOpenPanel.model === "Add Category" && <AddCategory />}
        {context.isOpenPanel.model === "Add SubCategory" && <AddSubCategory />}
        {context.isOpenPanel.model === "Add Address" && <Addadress />}
        {context.isOpenPanel.model === "Edit Category" && <EditCategory />}
        {context.isOpenPanel.model === "Edit Product" && <EditProduct />}
        {context.isOpenPanel.model === "Add Banner V1" && <Addbannerv1 />}
        {context.isOpenPanel.model === "Edit Banner V1" && <Editbannerv1 />}
        {context.isOpenPanel.model === "Add Blog" && <AddBlog />}
        {context.isOpenPanel.model === "Edit Blog" && <EditBlog />}
      </Dialog>
    </>
  );
}
