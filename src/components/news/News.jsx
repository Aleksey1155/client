import React, { useEffect, useState, useMemo } from "react";

import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import "./news.scss";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function News() {
  const { t, i18n } = useTranslation();
  const [newss, setNewss] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredNews, setFilteredNews] = useState([]);
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const isAdmin = window.location.pathname.includes("/admin");

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await axiosInstance.get("/news");
        // Сортуємо новини від біл до менш id і беремо останні 10
        const sortedNews = res.data.sort((a, b) => b.id - a.id).slice(0, 10);
        setNewss(res.data);
        setFilteredNews(sortedNews); // Встановлюємо відсорт новини як початковий стан
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNews();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  

  const handleDeleteNews = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей News?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/news/${id}`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMonthSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    filterNewsByMonth(month, year);
    setShowDropdown(false); // Закриваємо селект після вибору місяця
  };

  const filterNewsByMonth = (month, year) => {
    const filtered = newss.filter((news) => {
      const newsDate = new Date(news.news_date);
      return (
        newsDate.getFullYear() === year &&
        newsDate.getMonth() === months.indexOf(month)
      );
    });

    setFilteredNews(filtered.length ? filtered : []);
  };

  return (
    <div className="news">
      <div className="containerNews">
        <div className="newsName">
          <span>{t("ourNews")}</span>
          <div className="archive" onClick={toggleDropdown}>
            {t("archive")}
          </div>
          {showDropdown && (
            <div className="dropdown">
              <div className="column">
                <span>{previousYear}</span>
                <ul>
                  {months.map((month, index) => (
                    <li
                      key={index}
                      onClick={() => handleMonthSelect(month, previousYear)}
                    >
                      {month}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="column">
                <span>{currentYear}</span>
                <ul>
                  {months.map((month, index) => (
                    <li
                      key={index}
                      onClick={() => handleMonthSelect(month, currentYear)}
                    >
                      {month}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Якщо немає новин за вибраний місяць */}
        {selectedMonth && filteredNews.length === 0 && (
          <div className="blockMessageNews">
            <span>
              Даних немає за {selectedMonth} {selectedYear}
            </span>
          </div>
        )}

        {/* Виводимо новини */}
        {filteredNews.map((news) => (
          <div className="blockMessageNews" key={news.id}>
            <span className="userName">{news.role_name}</span>
            {isAdmin ? (
              <RemoveCircleOutlineOutlinedIcon
                className="iconDel"
                onClick={() => handleDeleteNews(news.id)}
              />
            ) : (
              ""
            )}

            <div className="messageNews">{news.news_text}</div>
            <span className="data">{t("date")} {formatDate(news.news_date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
