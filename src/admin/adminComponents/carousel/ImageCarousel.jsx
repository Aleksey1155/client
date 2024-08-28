import React from "react";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./imagecarousel.scss";


const ImageCarousel = ({ images }) => {
  // Перевіряємо, чи є більше одного зображення
  const isMultipleImages = images.length > 1;

  const settings = {
    dots: true,
    infinite: isMultipleImages, // Включаємо infinite лише коли більше одного зображення
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isMultipleImages, // Включаємо автоплей лише коли більше одного зображення
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Zoom>
              <img
                src={image.url}
                alt={`Slide ${index}`}
                className="carousel-image"
              />
            </Zoom>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;

  
 
  
