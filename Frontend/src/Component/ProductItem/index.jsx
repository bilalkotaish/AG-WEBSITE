import { Link } from "react-router-dom";
import { useContext } from "react";
import { myContext } from "../../App";

import Tooltip from "@mui/material/Tooltip";

import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoExpandOutline } from "react-icons/io5";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function ProductItem({ item }) {
  const context = useContext(myContext);

  const productId = item?.id || item?._id;
  const productName = item?.name || "AgCell Phone";

  const primaryImage = item?.images?.[0]?.url;
  const secondaryImage = item?.images?.[1]?.url;

  const categoryName =
    typeof item?.category === "object" ? item?.category?.name : item?.category;

  const isInWishlist = context?.isInWishlist(productId);

  const price = Number(item?.price || 0);
  const oldPrice = Number(item?.oldPrice || 0);

  const hasDiscount = oldPrice > price && price > 0;
  const saving = hasDiscount ? oldPrice - price : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    context.handleWishlist(item);
    context.getList();
  };

  return (
    <article className="product-card group relative flex h-full flex-col rounded-[30px] border border-[#e9e9e9] bg-white p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8B0000] hover:shadow-[0_12px_30px_rgba(139,0,0,0.25)]">
      {/* PRODUCT IMAGE STAGE */}
      <div className="product-card-image relative aspect-square overflow-hidden rounded-[23px] bg-[#f0f0f0]">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={productName}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover p-1 transition-all duration-500 ${
                secondaryImage
                  ? "[@media(hover:hover)]:group-hover:opacity-0"
                  : ""
              }`}
            />

            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={productName}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-5 opacity-0 transition-all duration-500 [@media(hover:hover)]:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Image coming soon
          </div>
        )}

        {/* SAVINGS BADGE */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FFC21A] px-3 py-1.5 text-xs font-bold text-[#0F1F4B]">
            Save {formatMoney(saving)}
          </span>
        )}

        {/* WISHLIST BUTTON */}
        <Tooltip
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <button
            type="button"
            onClick={handleWishlist}
            aria-pressed={isInWishlist}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#222] shadow-sm transition-all duration-200 hover:scale-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c21f1f]"
          >
            {isInWishlist ? (
              <IoMdHeart size={21} className="text-[#f44343]" />
            ) : (
              <IoMdHeartEmpty size={21} />
            )}
          </button>
        </Tooltip>

        {/* IMAGE PAGINATION */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <span className="h-[7px] w-[7px] rounded-full bg-[#348c6c]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#bdd4cc]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#bdd4cc]" />
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        {/* CATEGORY */}
        <span className="mb-1 text-[13px] font-medium text-[#348c6c]">
          {categoryName || "Smartphones"}
        </span>

        {/* PRODUCT NAME */}
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-[#171717]">
          <Link
            to={`/productdetails/${productId}`}
            className="outline-none after:absolute after:inset-0 after:rounded-[30px] focus-visible:after:ring-2 focus-visible:after:ring-[#348c6c]"
          >
            {productName}
          </Link>
        </h3>

        {/* PRICE */}
        <div className="mt-1 flex flex-col">
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatMoney(oldPrice)}
            </span>
          )}

          <span className="text-[19px] font-bold leading-tight text-[#171717]">
            {formatMoney(price)}
          </span>
        </div>

        {/* BUY BUTTON */}
        <Link
          to={`/productdetails/${productId}`}
          className="product-card-buy-button relative z-10 mt-3 flex h-[55px] w-full items-center justify-center rounded-full bg-[#0f1f4b] px-4 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#8B0000] hover:shadow-[0_4px_15px_rgba(139,0,0,0.35)] active:scale-95"
        >
          Buy Now
        </Link>
      </div>
    </article>
  );
}
