import slides from '@/assets/background';
import { Image } from "@/components";

const Background = () => {
  return (
    <div
      aria-hidden='true'
      className='fixed top-0 left-0 h-screen flex overflow-hidden -z-10 animate-[slideshow_40s_linear_infinite]'
      style={{ width: `${slides.length * 100}vw` }}
    >
      {slides.map((src, index) => (
        <Image
          key={index}
          src={src}
          className='w-screen h-screen opacity-60'
          radius='none'
        />
      ))}
    </div>
  );
};

export default Background;