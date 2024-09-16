import { useState, useEffect } from "react";
import "./stories.scss";
import axios from "axios";

const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.pexels.com/photos/27746385/pexels-photo-27746385.jpeg",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.pexels.com/photos/28170073/pexels-photo-28170073.jpeg",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.pexels.com/photos/11345329/pexels-photo-11345329.jpeg",
    },
  ];

function Stories({userId}) {
  

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${userId}`);
        setUser(res.data);
        console.log(res.data)
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllUsers();
  }, [userId]);


  console.log("---------" + userId)

console.log(user)
  return (
    <div className="stories">
     {/* <h1> USER NAME: {user.name}</h1> */}
        <div className="story">
          <img src={user.img} alt="" />
          <span>{user.name}</span>
          <button>+</button>
        </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Stories;
