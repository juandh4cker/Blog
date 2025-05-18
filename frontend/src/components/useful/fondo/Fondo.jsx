import slide1 from '../../../assets/slide1.jpg';
import slide2 from '../../../assets/slide2.jpg';
import slide3 from '../../../assets/slide3.jpeg';
import slide4 from '../../../assets/slide4.jpeg';

function Fondo() {
  const slides = [slide1, slide2, slide3, slide4];

  return (
    <div
      className="fixed top-0 left-0 w-[400vw] h-screen flex overflow-hidden -z-10 animate-[slideshow_40s_linear_infinite]"
    >
      {slides.map((src, idx) => (
        <div
          key={idx}
          className="flex-none w-screen h-screen bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}

export default Fondo;