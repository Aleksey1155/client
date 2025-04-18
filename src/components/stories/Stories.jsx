import { useState, useEffect } from "react";
import "./stories.scss";
import axiosInstance from "../../axiosInstance";
import Story from "../story/Story";

function Stories({ userData }) {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const res = await axiosInstance.get("/stories");
        setStories(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllStories();
  }, []);

  const openStoryModal = (story) => setSelectedStory(story);
  const closeStoryModal = () => setSelectedStory(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, stories.length - visibleCount)
    );
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + visibleCount);

  if (!userData) return <div className="stories">Loading...</div>;

  return (
    <div className="stories">
      <div className="storyUser">
        <img src={userData?.img} alt="" />
        <span>{userData?.name}</span>
        <button>+</button>
      </div>

      <div className="sliderContainer">
        {stories.length > visibleCount && (
          <button className="navButton left" onClick={handlePrev} disabled={currentIndex === 0}>
            &#8592;
          </button>
        )}

        <div className="sliderWindow">
          {visibleStories.map((story) => (
            <div className="story" key={story.id} onClick={() => openStoryModal(story)}>
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
        </div>

        {stories.length > visibleCount && (
          <button
            className="navButton right"
            onClick={handleNext}
            disabled={currentIndex >= stories.length - visibleCount}
          >
            &#8594;
          </button>
        )}
      </div>

      {selectedStory && (
        <Story isOpen={!!selectedStory} onClose={closeStoryModal} story={selectedStory} />
      )}
    </div>
  );
}

export default Stories;
