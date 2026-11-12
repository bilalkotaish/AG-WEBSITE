import { Button } from "@mui/material";
import { NavLink, Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { TbSlideshow } from "react-icons/tb";
import { PiUsersBold } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaRegNewspaper } from "react-icons/fa6";
import { TbTrademark } from "react-icons/tb";
import Collapse from "react-collapse";
import { useContext, useState } from "react";
import { Mycontext } from "../../App";

const navigationGroups = [
  {
    id: "slides",
    label: "Home slides",
    icon: TbSlideshow,
    links: [
      { label: "Banner slide list", to: "/homebanner/list" },
      {
        label: "Add banner slide",
        action: "AddBannerslider",
      },
    ],
  },
  {
    id: "banners",
    label: "Home banners",
    icon: TbSlideshow,
    links: [
      { label: "Banner list", to: "/homebannerv1/list" },
      { label: "Add banner", action: "Add Banner V1" },
    ],
  },
  {
    id: "blogs",
    label: "Blog",
    icon: FaRegNewspaper,
    links: [
      { label: "Blog list", to: "/bloglist" },
      { label: "Add blog", action: "Add Blog" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: AiOutlineProduct,
    links: [
      { label: "Product list", to: "/product" },
      { label: "Add product", action: "Add Product" },
      { label: "Product RAM options", to: "/addRams" },
      { label: "Product weight options", to: "/addweight" },
      { label: "Product size options", to: "/addsize" },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    icon: MdOutlineCategory,
    links: [
      { label: "Category list", to: "/Categorylist" },
      { label: "Add category", action: "Add Category" },
      { label: "Subcategory list", to: "/SubCategory/list" },
      { label: "Add subcategory", action: "Add SubCategory" },
    ],
  },
];

export default function Sidebar() {
  const [openGroup, setOpenGroup] = useState(null);
  const context = useContext(Mycontext);
  const location = useLocation();

  const openAction = (model) => {
    context.setisOpenPanel({ open: true, model });
    if (window.innerWidth < 768) context.setisSidebar(false);
  };

  return (
    <>
      {context.isSidebar && (
        <button
          type="button"
          className="mobile-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => context.setisSidebar(false)}
        />
      )}
      <aside
        onClick={(event) => {
          if (window.innerWidth < 768 && event.target.closest("a")) {
            context.setisSidebar(false);
          }
        }}
        className={`sidebar fixed left-0 top-0 h-full overflow-hidden transition-all duration-300 ${
          context.isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
        }`}
      >
      <div className="sidebar-brand mb-5 flex min-h-16 items-center gap-3 border-b border-white/10 px-2 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E31E24] text-lg font-black text-white shadow-lg shadow-red-950/30">
            A
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-[0.12em] text-white">
              AGCELL
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Store management
            </span>
          </span>
        </Link>
      </div>

      <div className="sidebar-scroll h-[calc(100%-5.5rem)] overflow-y-auto pb-5">
        {context.isSidebar && (
          <>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Workspace
            </p>
            <ul className="sidebar-nav space-y-1">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "is-active" : ""}`
                  }
                >
                  <RxDashboard className="text-[18px]" />
                  Dashboard
                </NavLink>
              </li>

              {navigationGroups.map((group) => {
                const GroupIcon = group.icon;
                const hasActiveLink = group.links.some(
                  (link) => link.to && location.pathname === link.to
                );
                const isOpen =
                  openGroup === group.id || (openGroup === null && hasActiveLink);

                return (
                  <li key={group.id}>
                    <Button
                      onClick={() =>
                        setOpenGroup((current) =>
                          current === group.id ? null : group.id
                        )
                      }
                      className={`admin-nav-trigger ${
                        hasActiveLink ? "is-active" : ""
                      }`}
                      aria-expanded={isOpen}
                    >
                      <GroupIcon className="text-[18px]" />
                      <span>{group.label}</span>
                      <FaAngleDown
                        className={`ml-auto transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    <Collapse isOpened={isOpen}>
                      <ul className="admin-subnav">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            {link.to ? (
                              <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                  `admin-subnav-link ${
                                    isActive ? "is-active" : ""
                                  }`
                                }
                              >
                                {link.label}
                              </NavLink>
                            ) : (
                              <button
                                type="button"
                                className="admin-subnav-link w-full text-left"
                                onClick={() => openAction(link.action)}
                              >
                                {link.label}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </li>
                );
              })}

              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "is-active" : ""}`
                  }
                >
                  <PiUsersBold className="text-[18px]" />
                  Customers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "is-active" : ""}`
                  }
                >
                  <LiaShippingFastSolid className="text-[18px]" />
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/brands"
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "is-active" : ""}`
                  }
                >
                  <TbTrademark className="text-[18px]" />
                  Brands
                </NavLink>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold text-white">Store status</p>
              <p className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Admin workspace active
              </p>
            </div>
          </>
        )}
      </div>
      </aside>
    </>
  );
}
