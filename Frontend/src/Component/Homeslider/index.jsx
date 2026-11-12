import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";

export default function HomeSlider(props) {
  return (
    <div className="homeslider w-full overflow-hidden rounded-2xl">
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        loop={props.data?.length > 1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="sliderhome"
      >
        {props.data?.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] bg-[#0B0B0D] flex items-center justify-center rounded-2xl overflow-hidden">
              <img
                src={item.images?.[0]?.url}
                className="w-full h-full object-cover"
                alt="banner"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}