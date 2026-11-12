import { createElement } from "react";
import { BsPieChartFill } from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";

const metrics = [
  {
    key: "users",
    label: "Customers",
    icon: FaUsers,
    color: "text-violet-600",
    background: "bg-violet-50",
  },
  {
    key: "orderData",
    label: "Orders",
    icon: LiaShippingFastSolid,
    color: "text-blue-600",
    background: "bg-blue-50",
  },
  {
    key: "product",
    label: "Products",
    icon: AiOutlineProduct,
    color: "text-[#8B0000]",
    background: "bg-red-50",
  },
  {
    key: "catData",
    label: "Categories",
    icon: BsPieChartFill,
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: MdOutlineRateReview,
    color: "text-amber-600",
    background: "bg-amber-50",
  },
];

export default function DashboardBox(props) {
  return (
    <section
      aria-label="Store overview"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
    >
      {metrics.map(({ key, label, icon, color, background }) => (
        <article
          key={key}
          className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${background} ${color}`}
          >
            {createElement(icon, { className: "text-xl" })}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium text-slate-500">
              {label}
            </span>
            <span className="mt-1 block text-2xl font-bold leading-none text-slate-900">
              {props[key] ?? 0}
            </span>
          </span>
        </article>
      ))}
    </section>
  );
}
