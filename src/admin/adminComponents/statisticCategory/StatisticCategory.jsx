import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import Graphs from "../../adminComponents/graphs/Graphs";
import "./statisticCategory.scss";

const StatisticCategory = (category) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          category === "user"
            ? "/users"
            : category === "project"
            ? "/projects"
            : category === "expense"
            ? "/expenses"
            : category === "balance"
            ? "/balance"
            : "";

        if (!endpoint) return;

        const res = await axiosInstance.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [category]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="statistic-category">
      <div className="statCatContaner">
        <h2>{category} STATISTICS</h2>
        <div className="statCatWidget">
          <div className="statCatList">
            {data.length > 0 ? (
              data.map((item, index) => {
                if (!item) return null;

                const {
                  name,
                  title,
                  img,
                  image_url,
                  email,
                  start_date,
                  phone,
                  end_date,
                  job_name,
                  status_name,
                } = item;

                return (
                  <div key={index} className="list-item">
                    <div
                      className="statCatCard"
                      onClick={() => setSelectedItem(item)} // Зберігаємо вибраний об'єкт
                    >
                      <div className="statCard1">{name}</div>
                      <img
                        className="statCard5"
                        src={img || image_url}
                        alt={name || title || "Image"}
                      />
                      <div className="statCard">
                        {email || (start_date && formatDate(start_date))}
                      </div>
                      <div className="statCard">
                        {phone || (end_date && formatDate(end_date))}
                      </div>
                      <div className="statCard">{job_name || status_name}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        <div className="charts">
          <Graphs selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  );
};

export default StatisticCategory;
