import Slider from "react-slick";
import "./storySlider.scss"; // окремі стилі тільки для слайдера

function StorySlider({ stories, onClick }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="storySliderWrapper">
      <Slider {...settings}>
        {stories.map((story) => (
          <div
            className="story"
            key={story.id}
            onClick={() => onClick(story)}
          >
            {story.video.endsWith(".mp4") ||
            story.video.endsWith(".webm") ||
            story.video.endsWith(".ogg") ? (
              <video src={story.video} muted width="100%" />
            ) : (
              <img src={story.video} alt="story" />
            )}
            <span>added by: {story.name}</span>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default StorySlider;
