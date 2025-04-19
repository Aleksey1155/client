import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { Link } from "react-router-dom";
import "./posts.scss";
import Post from "../post/Post";
import AddPost from "../addpost/AddPost";
import AddStory from "../addstory/AddStory";
import UserProfile from "../../pages/userprofile/UserProfile";

function Posts({ userData }) {
  const [posts, setPosts] = useState([]);

  console.log("DATA POSTS", posts);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        setPosts(Array.isArray(res.data) ? res.data : []);
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
      {Array.isArray(posts) &&
        [...posts]
          .reverse()
          .map((post) => (
            <Post post={post} key={post.id} userData={userData} />
          ))}
    </div>
  );
}

export default Posts;
