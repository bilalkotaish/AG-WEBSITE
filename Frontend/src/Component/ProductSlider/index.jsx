import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem/index.jsx";
export default function ProductSlider(props) {
  return (
    <div className="productslider py-1">
      <Swiper
        navigation={true}
        modules={[Navigation]}
        spaceBetween={30}
        className="mySwiper"
        slidesPerView={props.items}
      >
        {props.data?.length !== 0 &&
          props.data?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="item h-full w-full pb-2">
                  <ProductItem item={item} />
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
