import { Link } from "react-router-dom";
import ProductItem from "../ProductItem";

export default function CategorySection({ category, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end">
            {/* Category Information */}
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-[#8B0000]"></span>

                <span className="break-words text-sm font-bold uppercase tracking-[0.12em] text-[#8B0000] sm:text-[18px] sm:tracking-[0.2em]">
                  Explore {category.name}
                </span>
              </div>

              {category.description && (
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  {category.description}
                </p>
              )}
            </div>

            {/* View All Button */}
            <Link
              to={`/products?category=${category._id}`}
              className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[#8B0000] px-6 py-3 text-sm font-bold text-[#8B0000] transition-all duration-300 hover:bg-[#8B0000] hover:text-white hover:shadow-lg hover:shadow-red-900/20"
            >
              View All Products
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, 5).map((item) => (
            <ProductItem key={item._id || item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
