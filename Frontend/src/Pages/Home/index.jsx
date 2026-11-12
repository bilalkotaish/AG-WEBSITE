import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { FaShippingFast } from "react-icons/fa";

import { myContext } from "../../App.jsx";
import { fetchData } from "../../utils/api.js";

import Catslider from "../../Component/Catslider/index.jsx";
import HomeSlider from "../../Component/Homeslider/index.jsx";
import CategorySection from "../../Component/CategorySection/CategorySection.jsx";

import "./../../index.css";

export default function Home() {
  const context = useContext(myContext);

  // States
  const [catData, setCatData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [allproductData, setallProductData] = useState([]);
  const [BlogData, setBlogData] = useState([]);

  const [Featured, setFeatured] = useState([]);

  // Sync categories from Context
  useEffect(() => {
    setCatData(context.catData || []);
  }, [context.catData]);

  // Fetch Homepage Data
  useEffect(() => {
    let isMounted = true;

    const loadHomeResource = async (endpoint, apply) => {
      try {
        const result = await fetchData(endpoint);
        if (!isMounted) return;
        apply(result);
      } catch (error) {
        console.error(`Error loading homepage resource ${endpoint}:`, error);
      }
    };

    void loadHomeResource("/api/homebanner/get", (res) =>
      setBannerData(res?.banners || []),
    );
    void loadHomeResource("/api/product/products", (res) =>
      setallProductData(res?.data || []),
    );
    void loadHomeResource("/api/product/isFeatured", (res) =>
      setFeatured(res?.data || []),
    );
    void loadHomeResource("/api/blog/get", (res) =>
      setBlogData(res?.data || []),
    );
    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Products By Category
  const getCategoryProducts = (categoryId) => {
    return allproductData.filter((product) => {
      const productCategory =
        typeof product.category === "object"
          ? product.category?._id || product.category?.id
          : product.category;

      return String(productCategory) === String(categoryId);
    });
  };

  // Prepare only categories that have products
  const categorySections = catData
    .map((category) => ({
      category,
      products: getCategoryProducts(category._id),
    }))
    .filter((item) => item.products.length > 0);

  // First two category sections
  const firstCategorySections = categorySections.slice(0, 2);

  // Remaining category sections
  const remainingCategorySections = categorySections.slice(2);
  const featuredBlog = BlogData[0];
  const additionalBlogs = BlogData.slice(1, 4);

  const getBlogText = (content) =>
    (content || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

  const formatBlogDate = (date) => {
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "AgCell Journal"
      : parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* HOME BANNER */}
      {bannerData.length > 0 && (
        <section className="w-full">
          <HomeSlider data={bannerData} />
        </section>
      )}

      {/* CATEGORY SLIDER */}
      {catData.length > 0 && (
        <section className="w-full">
          <Catslider data={catData} />
        </section>
      )}

      {/* FIRST TWO CATEGORY PRODUCT SECTIONS */}
      {firstCategorySections.length > 0 && (
        <div className="w-full bg-white">
          {firstCategorySections.map(({ category, products }) => (
            <CategorySection
              key={category._id}
              category={category}
              products={products}
            />
          ))}
        </div>
      )}

      {/* FREE SHIPPING BANNER - AFTER TWO CATEGORY SECTIONS */}
      {categorySections.length >= 2 && (
        <section className="w-full bg-white px-4 py-8 sm:py-10 md:py-12">
          <div className="container mx-auto">
            <div className="group relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl border border-[#eadede] bg-[#faf8f8] px-5 py-7 shadow-sm transition-all duration-300 hover:border-[#8B0000] hover:shadow-[0_10px_30px_rgba(139,0,0,0.10)] sm:px-8 md:gap-6 md:px-10 lg:flex-row">
              {/* Decorative Accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-[#8B0000] sm:w-1.5" />

              {/* Shipping Icon + Text */}
              <div className="flex w-full items-center justify-center gap-3 sm:gap-4 lg:w-auto lg:flex-1 lg:justify-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B0000]/10 text-[#8B0000] transition-all duration-300 group-hover:bg-[#8B0000] group-hover:text-white sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <FaShippingFast className="text-2xl sm:text-3xl" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold uppercase tracking-wide text-[#0F1F4B] sm:text-lg md:text-xl">
                    Free Shipping
                  </h3>

                  <p className="mt-1 text-xs text-[#5B6785] sm:text-sm">
                    Fast delivery, straight to your door.
                  </p>
                </div>
              </div>

              {/* Shipping Message */}
              <div className="w-full text-center lg:w-auto lg:flex-1">
                <p className="text-xs font-medium text-[#5B6785] sm:text-sm">
                  Enjoy complimentary delivery
                </p>

                <p className="mt-1 text-base font-bold text-[#0F1F4B] sm:text-lg">
                  On all orders over{" "}
                  <span className="text-[#8B0000]">$100</span>
                </p>
              </div>

              {/* Shop Button */}
              <div className="w-full sm:w-auto lg:flex-1 lg:text-right">
                <Link
                  to="/products"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#650000] hover:shadow-lg active:scale-95 sm:h-12 sm:w-auto sm:min-w-[150px] sm:inline-flex"
                >
                  Shop Now
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {context.brandData?.length > 0 && (
        <section className="w-full bg-white px-4 py-10 sm:py-12">
          <div className="container mx-auto">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-[#8B0000]"></span>

                <span className="break-words text-sm font-bold uppercase tracking-[0.12em] text-[#8B0000] sm:text-[18px] sm:tracking-[0.2em]">
                  Explore Our brands
                </span>
              </div>
              <Link
                to="/products"
                className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[#8B0000] px-6 py-3 text-sm font-bold text-[#8B0000] transition-all duration-300 hover:bg-[#8B0000] hover:text-white hover:shadow-lg hover:shadow-red-900/20"
              >
                View all products
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {context.brandData.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/products?brandId=${encodeURIComponent(brand._id)}`}
                  className="group flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#8B0000]/40 hover:shadow-md sm:min-h-40"
                >
                  <img
                    src={brand.image?.url}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    className="h-16 w-full max-w-[150px] object-contain transition-transform group-hover:scale-105 sm:h-20"
                  />
                  <span className="text-sm font-bold text-[#0F1F4B] group-hover:text-[#8B0000]">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REMAINING CATEGORY PRODUCT SECTIONS */}
      {remainingCategorySections.length > 0 && (
        <div className="w-full bg-white">
          {remainingCategorySections.map(({ category, products }) => (
            <CategorySection
              key={category._id}
              category={category}
              products={products}
            />
          ))}
        </div>
      )}

      {featuredBlog && (
        <section
          aria-labelledby="journal-title"
          className="w-full bg-white px-4 py-12 sm:py-16 md:py-20"
        >
          <div className="container mx-auto">
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 inline-flex items-center gap-2 text-[16px] font-bold uppercase tracking-[0.2em] text-[#8B0000]">
                  <span className="h-5 w-1 rounded-full bg-[#8B0000]"></span>
                  <span className="break-words text-sm font-bold uppercase tracking-[0.12em] text-[#8B0000] sm:text-[18px] sm:tracking-[0.2em]" />
                  The AgCell journal
                </span>
                <h2
                  id="journal-title"
                  className="text-3xl font-extrabold tracking-tight text-[#0F1F4B] sm:text-4xl"
                >
                  Ideas for a smarter life.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Expert advice, fresh perspectives, and the latest from the
                  world of mobile technology.
                </p>
              </div>
              <Link
                to={`/blog/${featuredBlog._id}`}
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-[#0F1F4B] transition hover:border-[#8B0000] hover:text-[#8B0000] sm:self-auto"
              >
                Explore the journal <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
              <article className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl md:grid-cols-[1.05fr_0.95fr]">
                <Link
                  to={`/blog/${featuredBlog._id}`}
                  aria-label={`Read ${featuredBlog.title}`}
                  className="relative block min-h-60 overflow-hidden bg-slate-200 sm:min-h-80 md:min-h-[410px]"
                >
                  {featuredBlog.image?.[0]?.url ? (
                    <img
                      src={featuredBlog.image[0].url}
                      alt={
                        featuredBlog.title || "Featured AgCell journal article"
                      }
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F1F4B] to-[#8B0000]" />
                  )}
                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B0000] shadow-sm">
                    Editor&apos;s pick
                  </span>
                </Link>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {formatBlogDate(featuredBlog.createdAt)}
                    <span className="mx-2 text-[#8B0000]">•</span>
                    Featured story
                  </p>
                  <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#0F1F4B] sm:text-3xl">
                    <Link
                      to={`/blog/${featuredBlog._id}`}
                      className="transition hover:text-[#8B0000]"
                    >
                      {featuredBlog.title}
                    </Link>
                  </h3>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {getBlogText(featuredBlog.description).slice(0, 230)}
                    {getBlogText(featuredBlog.description).length > 230
                      ? "…"
                      : ""}
                  </p>
                  <Link
                    to={`/blog/${featuredBlog._id}`}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#8B0000]"
                  >
                    Read the story <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>

              {additionalBlogs.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {additionalBlogs.map((item) => {
                    const excerpt = getBlogText(item.description);
                    return (
                      <article
                        key={item._id}
                        className="group grid min-h-40 grid-cols-[116px_1fr] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md sm:grid-cols-[140px_1fr] lg:min-h-0 lg:grid-cols-[150px_1fr]"
                      >
                        <Link
                          to={`/blog/${item._id}`}
                          aria-label={`Read ${item.title}`}
                          className="relative min-h-full overflow-hidden bg-slate-200"
                        >
                          {item.image?.[0]?.url ? (
                            <img
                              src={item.image[0].url}
                              alt={item.title || "AgCell journal article"}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1F4B] to-[#8B0000]" />
                          )}
                        </Link>
                        <div className="flex min-w-0 flex-col justify-center p-4 sm:p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {formatBlogDate(item.createdAt)}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-[#0F1F4B] sm:text-lg">
                            <Link
                              to={`/blog/${item._id}`}
                              className="transition hover:text-[#8B0000]"
                            >
                              {item.title}
                            </Link>
                          </h3>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                            {excerpt}
                          </p>
                          <Link
                            to={`/blog/${item._id}`}
                            className="mt-3 text-xs font-bold text-[#8B0000]"
                          >
                            Read article <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
