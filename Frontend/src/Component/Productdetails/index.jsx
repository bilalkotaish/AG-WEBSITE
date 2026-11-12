import { useEffect, useRef, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import {
  MdOutlineAddShoppingCart,
  MdLocalShipping,
  MdVerifiedUser,
  MdOutlineInventory2,
} from "react-icons/md";

import { FiChevronRight, FiCheck, FiArrowUpRight } from "react-icons/fi";

import { FaRegCreditCard } from "react-icons/fa";

import ProductSlider from "../ProductSlider";
import Qtybox from "../Qtybox";

import { fetchData } from "../../utils/api";
import { myContext } from "../../App";
import { Rating } from "@mui/material";

export default function ProductDetails() {
  const { id } = useParams();
  const context = useContext(myContext);

  const mainSwiperRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [loading, setLoading] = useState(true);

  const colors = product?.productColor || [];
  const sizes = product?.size || [];
  const images = product?.images || [];

  const stock = Number(product?.countInStock || 0);
  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.oldprice || 0);

  const isInStock = stock > 0;

  // Fetch product and related products
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setProduct(null);
      setRelatedProducts([]);
      setSlideIndex(0);
      setSelectedColor("");
      setSelectedSize("");
      setQuantity(1);

      try {
        const res = await fetchData(`/api/product/${id}`);

        if (!isMounted) return;

        if (res?.error === false && res?.data) {
          const productData = res.data;

          setProduct(productData);

          if (productData?.productColor?.length > 0) {
            setSelectedColor(productData.productColor[0]);
          }

          if (productData?.size?.length > 0) {
            setSelectedSize("");
          }

          if (productData?.subcatId) {
            const relatedRes = await fetchData(
              `/api/product/productSub/${productData.subcatId}`,
            );

            if (!isMounted) return;

            if (relatedRes?.error === false) {
              const filtered = (relatedRes?.data || []).filter(
                (item) => String(item._id) !== String(id),
              );

              setRelatedProducts(filtered);
            }
          }
        } else {
          console.error("Error fetching product details");
        }
      } catch (error) {
        console.error("Product loading error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Quantity handler
  const handleSelectQty = (qty) => {
    setQuantity(qty);
  };

  // Thumbnail navigation
  const handleThumbnailClick = (index) => {
    setSlideIndex(index);
    mainSwiperRef.current?.slideTo(index);
  };

  // Add product to cart
  const Addtocart = () => {
    const hasColorOptions = colors.length > 0;
    const hasSizeOptions = sizes.length > 0;

    if (!isInStock) {
      context?.Alertbox?.("error", "This product is currently out of stock.");
      return;
    }

    if (hasColorOptions && !selectedColor) {
      context?.Alertbox?.("error", "Please select a color.");
      return;
    }

    if (hasSizeOptions && !selectedSize) {
      context?.Alertbox?.("error", "Please select a size.");
      return;
    }

    if (quantity < 1 || quantity > stock) {
      context?.Alertbox?.("error", "Please select a valid quantity.");
      return;
    }

    const productItems = {
      ...product,
      size: selectedSize,
      color: selectedColor,
    };

    context?.AddtoCart?.(productItems, context?.userData?._id, quantity);

    context?.Alertbox?.("success", "Product added to cart!");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#fafafa] px-4 py-16">
        <div className="container mx-auto grid gap-10 lg:grid-cols-2">
          <div className="h-[450px] animate-pulse rounded-3xl bg-gray-200" />
          <div className="space-y-5">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-24 animate-pulse rounded bg-gray-200" />
            <div className="h-14 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fafafa] px-4 text-center">
        <MdOutlineInventory2 className="mb-4 text-6xl text-gray-300" />

        <h2 className="text-2xl font-bold text-[#0F1F4B]">Product not found</h2>

        <p className="mt-2 text-gray-500">
          This product may have been removed or is no longer available.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-full bg-[#8B0000] px-7 py-3 font-semibold text-white transition hover:bg-[#650000]"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <section className="product-details-page w-full bg-white py-6 md:py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-7 flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
          <Link
            to="/"
            className="font-medium text-gray-500 transition hover:text-[#8B0000]"
          >
            Home
          </Link>

          <FiChevronRight className="text-gray-300" />

          <Link
            to="/products"
            className="font-medium text-gray-500 transition hover:text-[#8B0000]"
          >
            Products
          </Link>

          {product.category.name && (
            <>
              <FiChevronRight className="text-gray-300" />

              <span className="font-medium text-gray-500">
                {product.category.name}
              </span>
            </>
          )}

          <FiChevronRight className="text-gray-300" />

          <span className="max-w-[180px] truncate font-semibold text-[#0F1F4B]">
            {product.name}
          </span>
        </div>

        {/* Product information */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: Product gallery */}
          <div className="product-detail-gallery min-w-0">
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 md:p-7">
              {product.discount > 0 && (
                <div className="absolute left-6 top-6 z-10 rounded-md bg-[#8B0000] px-3 py-1.5 text-xs font-bold text-white">
                  SAVE {product.discount}%
                </div>
              )}

              {!isInStock && (
                <div className="absolute right-6 top-6 z-10 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-[#8B0000] ring-1 ring-[#8B0000]">
                  OUT OF STOCK
                </div>
              )}

              <Swiper
                modules={[Navigation]}
                navigation
                onSwiper={(swiper) => {
                  mainSwiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setSlideIndex(swiper.activeIndex);
                }}
                className="product-main-swiper"
              >
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <SwiperSlide key={image._id || image.url || index}>
                      <div className="flex h-[320px] items-center justify-center bg-white md:h-[440px]">
                        <img
                          src={image.url}
                          alt={`${product.name} - ${index + 1}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="flex h-[320px] items-center justify-center bg-white text-sm text-gray-400 md:h-[440px]">
                      No image available
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image._id || image.url || index}
                    type="button"
                    onClick={() => {
                      setSlideIndex(index);
                      mainSwiperRef.current?.slideTo(index);
                    }}
                    className={`flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 transition md:h-24 md:w-24 ${
                      slideIndex === index
                        ? "border-[#8B0000] ring-1 ring-[#8B0000]"
                        : "border-gray-200 hover:border-[#8B0000]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product details */}
          <div className="product-info-panel min-w-0 bg-white">
            {/* Brand and category */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {product.brand && (
                <span className="text-sm font-bold uppercase tracking-wider text-[#8B0000]">
                  {product.brand}
                </span>
              )}

              {product.category.name && (
                <>
                  {product.brand && (
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                  )}

                  <span className="text-sm text-gray-500">
                    {product.category.name}
                  </span>
                </>
              )}
            </div>

            {/* Product name */}
            <h1 className="mb-4 text-2xl font-bold leading-tight text-[#0F1F4B] md:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="mb-5 flex items-center gap-2">
                <Rating
                  value={Number(product.rating) || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                />

                <span className="text-sm text-gray-500">
                  {Number(product.rating).toFixed(1)} / 5
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 border-y border-gray-100 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-extrabold text-[#8B0000] md:text-4xl">
                  ${price.toFixed(2)}
                </span>

                {oldPrice > price && (
                  <span className="text-lg text-gray-400 line-through">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}

                {product.discount > 0 && (
                  <span className="rounded-md px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-200">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <p className="mt-2 text-md text-gray-500">
                Final price displayed in USD.
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-7">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#0F1F4B]">
                  Description
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color selection */}
            {product.productColor?.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0F1F4B]">Color:</h3>

                  <span className="text-sm text-gray-500">{selectedColor}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.productColor.map((color, index) => {
                    const colorValue = getColorValue(color);
                    const colorCode = getColorCode(color);

                    return (
                      <button
                        key={`${colorValue}-${index}`}
                        type="button"
                        title={colorValue}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                          selectedColor === colorValue
                            ? "border-[#8B0000] ring-2 ring-[#8B0000]/15"
                            : "border-gray-200 hover:border-[#8B0000]"
                        }`}
                      >
                        <span
                          className="h-7 w-7 rounded-full border border-black/10"
                          style={{ backgroundColor: colorCode }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.size?.length > 0 && (
              <div className="mb-6">
                <label
                  htmlFor="product-size"
                  className="mb-3 block text-sm font-bold text-[#0F1F4B]"
                >
                  Select Size
                </label>

                <select
                  id="product-size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F1F4B] outline-none transition focus:border-[#8B0000]"
                >
                  <option value="">Choose a size</option>

                  {product.size.map((size, index) => (
                    <option key={`${size}-${index}`} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isInStock ? "bg-green-500" : "bg-[#8B0000]"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  isInStock ? "text-green-700" : "text-[#8B0000]"
                }`}
              >
                {isInStock
                  ? `${product.countInStock} items available`
                  : "Currently unavailable"}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-7 flex flex-col gap-3 sm:flex-row">
              {isInStock && (
                <div className="flex items-center">
                  <Qtybox
                    handleSelectQty={handleSelectQty}
                    initialQuantity={quantity}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={Addtocart}
                disabled={!isInStock}
                className="flex min-h-[50px] flex-1 items-center justify-center gap-3 rounded-lg bg-[#8B0000] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#700000] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <MdOutlineAddShoppingCart size={21} />

                {isInStock ? "ADD TO CART" : "OUT OF STOCK"}
              </button>
            </div>

            {/* Purchase information */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3">
                <MdLocalShipping className="flex-shrink-0 text-xl text-[#8B0000]" />

                <div>
                  <p className="text-sm font-semibold text-[#0F1F4B]">
                    Delivery available
                  </p>

                  <p className="text-xs text-gray-500">
                    Contact us for delivery details.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaRegCreditCard className="flex-shrink-0 text-lg text-[#8B0000]" />

                <div>
                  <p className="text-sm font-semibold text-[#0F1F4B]">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    Pay when your order arrives.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MdVerifiedUser className="flex-shrink-0 text-xl text-[#8B0000]" />

                <div>
                  <p className="text-sm font-semibold text-[#0F1F4B]">
                    Trusted shopping
                  </p>

                  <p className="text-xs text-gray-500">
                    Shop confidently with AgCell.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MdOutlineInventory2 className="flex-shrink-0 text-xl text-[#8B0000]" />

                <div>
                  <p className="text-sm font-semibold text-[#0F1F4B]">
                    Product availability
                  </p>

                  <p className="text-xs text-gray-500">
                    Stock availability is updated regularly.
                  </p>
                </div>
              </div>
            </div>

            {/* Product benefits */}
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-gray-100 pt-5">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheck className="text-green-600" />
                Quality products
              </span>

              <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheck className="text-green-600" />
                Customer support
              </span>

              <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheck className="text-green-600" />
                Secure ordering
              </span>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-10">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#8B0000]">
                  You may also like
                </p>

                <h2 className="text-2xl font-bold text-[#0F1F4B] md:text-3xl">
                  Related Products
                </h2>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 text-sm font-semibold text-[#8B0000] transition hover:gap-3 sm:flex"
              >
                View all
                <FiChevronRight />
              </Link>
            </div>

            <ProductSlider data={relatedProducts} />
          </div>
        )}
      </div>
    </section>
  );
}
