import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { Link } from "react-router-dom";
import "./posts.scss";
import Post from "../post/Post";
import AddPost from "../addpost/AddPost";
import AddStory from "../addstory/AddStory";
import UserProfile from "../../pages/userprofile/UserProfile";

function Posts({ userData }) {
  const [posts, setPosts] = useState([]);

  // console.log("User DATA POSTS", userData);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="posts">
      <div className="addStoryPost">
        <button className="btnAddStoryPost">
          <AddPost userData={userData} />
        </button>
        <button className="btnAddStoryPost">
          <AddStory userData={userData} />
        </button>
      </div>
      {[...posts].reverse().map((post) => (
        <Post post={post} key={post.id} userData={userData} />
      ))}
    </div>
  );
}

export default Posts;
