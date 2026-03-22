import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay} from 'swiper/modules' 
import { promises} from '../data/promises.jsx'
import { promiseIcons } from '../data/promiseIcons.jsx';
import 'swiper/css'

const Carousel = () => {
  return (
    <section className='w-full max-w-[1380px] mx-auto px-6 py-12'>
      <h3 className='text-center text-amber-900 tracking-wide text-4xl font-bold font-heading mb-4'> Why Choose Us </h3>
      <Swiper
      modules={[Autoplay]}
      spaceBetween={24}
      loop={true}
      autoplay={{ delay: 2800, disableOnInteraction: false }}
        breakpoints={{
          480:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {promises.map((item) => (
          <SwiperSlide key={item.id} className='h-auto'>
            <div className='flex flex-col items-center gap-3 bg-white border border-[#e8e0d0] rounded-xl p-6 min-h-[220px] h-full hover:shadow-[0_6px_24px_rgba(180,150,80,0.15)] transition-shadow duration-200'>
              <div className='w-20 h-20 flex items-center justify-center'>
                {promiseIcons[item.iconKey]}
              </div>
              <h3 className="font-bold text-black text-xl font-body">
                {item.title}
              </h3>
              <p className="text-md text-gray-500 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;
