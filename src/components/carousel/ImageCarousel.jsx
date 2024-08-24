import React from "react";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./imagecarousel.scss";


const ImageCarousel = ({ images }) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
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
  
