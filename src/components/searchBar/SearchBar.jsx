import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../axiosInstance";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useLocation } from "react-router-dom";
import "./searchBar.scss";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ClearIcon from "@mui/icons-material/Clear";

function SearchBar({ placeholder = "Search..." }) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const location = useLocation();
  const searchRef = useRef(null); // 🔑 для відслідковування кліку поза

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/api/search?q=${searchText}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 500);

    setDebounceTimer(timer);
  }, [searchText]);

  const handleResultClick = () => {
    setSearchText("");
    setSearchResults([]);
  };

  // 🔻 Ховати список при кліку поза
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case "user":
        return <PersonOutlineIcon className="result-icon" />;
      case "task":
        return <AssignmentOutlinedIcon className="result-icon" />;
      case "project":
        return <FolderOutlinedIcon className="result-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="input-wrapper">
        <input
          className="input"
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {searchText && (
          <ClearIcon
            className="clear-icon"
            onClick={() => {
              setSearchText("");
              setSearchResults([]);
            }}
          />
        )}

        <SearchOutlinedIcon className="icon" />
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item) => (
            <Link
              to={`/admin/${item.type}/${item.id}`}
              key={item.type + item.id}
              onClick={handleResultClick}
            >
              <div className="result-item">
                {getIconForType(item.type)}
                &nbsp;{item.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
