import slides from "@/assets/background";

const Background = () => {
  return (
    <div
      aria-hidden='true'
      className='fixed top-0 left-0 h-screen flex overflow-hidden -z-10 animate-[slideshow_40s_linear_infinite]'
      style={{ width: `${slides.length * 100}vw` }}
    >
      {slides.map((src, index) => (
        <div
          key={index}
          className='flex-none w-screen h-screen opacity-60'
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}
    </div>
  );
}

export default Background;