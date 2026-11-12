import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { MdCloudUpload } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { BsBagCheck } from "react-icons/bs";
import { GoChecklist } from "react-icons/go";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadImage } from "../../utils/api";
import { LiaMapMarkedSolid } from "react-icons/lia";

export default function Accountsidebar() {
  const [preview, setpreview] = useState([]);
  const [upload, setupload] = useState(false);
  const context = useContext(myContext);

  useEffect(() => {
    const userAvatar = [];

    if (
      context?.userData?.Avatar !== "" &&
      context?.userData?.Avatar !== undefined
    ) {
      userAvatar.push(context?.userData?.Avatar);
      setpreview(userAvatar);
    }
  }, [context?.userData]);

  const onchangefile = async (e, apiEndPoint) => {
    try {
      setpreview([]);
      const files = e.target.files;
      setupload(true);

      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        if (
          files[i] &&
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            files[i].type,
          )
        ) {
          formData.append("Avatar", files[i]);

          const res = await uploadImage("/api/user/user-avatar", formData);

          console.log("Response data:", res);

          if (res?.Avatar) {
            setupload(false);
            setpreview([res.Avatar]);
            context.Alertbox("success", "Image Uploaded Successfully");
          }
        } else {
          context.Alertbox("error", "Please select only image file");
          setupload(false);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      setupload(false);
    }
  };

  const accountLinks = [
    {
      to: "/myaccount",
      label: "My Profile",
      icon: <FaRegUser />,
    },
    {
      to: "/address",
      label: "My Address",
      icon: <LiaMapMarkedSolid />,
    },
    {
      to: "/mylist",
      label: "My List",
      icon: <GoChecklist />,
    },
    {
      to: "/myorders",
      label: "My Orders",
      icon: <BsBagCheck />,
    },
    {
      to: "/logout",
      label: "Logout",
      icon: <RiLogoutBoxLine />,
    },
  ];

  return (
    <aside className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* User Profile */}
      <div className="flex flex-col items-center border-b border-gray-100 px-5 py-7">
        <div className="group relative mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md ring-1 ring-gray-200">
          {upload ? (
            <div className="flex h-full w-full items-center justify-center bg-white">
              <CircularProgress size={30} sx={{ color: "#0F1F4B" }} />
            </div>
          ) : preview.length > 0 ? (
            preview.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            ))
          ) : (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSktcnWbHej5LP9gi_MAZXL1HvYlEpb9MLLsA&s"
              alt="Default avatar"
              className="h-full w-full object-cover"
            />
          )}

          {/* Upload Overlay */}
          <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-[#0F1F4B]/70 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <MdCloudUpload className="text-3xl text-white" />

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              name="Avatar"
              disabled={upload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => onchangefile(e, "/api/user/user-avatar")}
            />
          </div>
        </div>

        <h3 className="text-center text-lg font-bold text-[#0F1F4B]">
          {context?.userData?.name || "My Account"}
        </h3>

        <p className="mt-1 max-w-full truncate text-center text-sm text-gray-500">
          {context?.userData?.email}
        </p>

        <span className="mt-3 rounded-full bg-[#0F1F4B]/5 px-4 py-1 text-xs font-semibold text-[#0F1F4B]">
          Personal Account
        </span>
      </div>

      {/* Account Navigation */}
      <div className="p-3">
        <p className="mb-2 px-3 pt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Account Menu
        </p>

        <ul className="space-y-1">
          {accountLinks.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/mylist" || item.to === "/myorders"}
                className={({ isActive }) =>
                  `account-sidebar-link flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "active bg-[#0F1F4B] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#0F1F4B]/5 hover:text-[#0F1F4B]"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                <span className="ml-auto text-xs opacity-60">›</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-center text-xs text-gray-400">
          AgCell · Your account
        </p>
      </div>
    </aside>
  );
}
