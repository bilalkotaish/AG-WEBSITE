import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "./style.css";

export default function Catslider(props) {
  return (
    <section className="catslider bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-[#8B0000]"></span>
            <span className="break-words text-sm font-bold uppercase tracking-[0.12em] text-[#8B0000] sm:text-[18px] sm:tracking-[0.2em]">
              Explore our Categories
            </span>
          </div>
          {/* View All Button */}

          <Link
            to="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[#8B0000] px-6 py-3 text-sm font-bold text-[#8B0000] transition-all duration-300 hover:bg-[#8B0000] hover:text-white hover:shadow-lg hover:shadow-red-900/20"
          >
            View All Products →
          </Link>
        </div>

        {/* Categories Slider */}
        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          navigation={false}
          modules={[Navigation]}
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 22,
            },
          }}
          className="sliderhome !pb-3"
        >
          {props.data?.map((item) => (
            <SwiperSlide key={item.id || item._id}>
              <Link to="/products" className="group block">
                <div className="relative mx-auto flex h-[185px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#0F1F4B]/20 hover:shadow-[0_8px_25px_rgba(15,31,75,0.10)] sm:h-[200px]">
                  {/* Image */}
                  <div className="flex h-[120px] w-full items-center justify-center overflow-hidden">
                    <img
                      src={item?.images?.[0]?.url}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="mt-3 flex w-full items-center justify-center">
                    <h3 className="truncate text-center text-sm font-bold text-[#0F1F4B] transition-colors duration-300 group-hover:text-[#8B0000] md:text-base">
                      {item.name}
                    </h3>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 h-[3px] w-0 rounded-full bg-[#8B0000] transition-all duration-300 group-hover:w-1/2" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile View All */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F1F4B] hover:text-[#8B0000]"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
