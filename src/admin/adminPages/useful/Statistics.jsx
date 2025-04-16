import { useState, useEffect } from "react";
import "./statistics.scss";
import axiosInstance from "../../../axiosInstance";
import Graphs from "../../adminComponents/graphs/Graphs";
import { useTranslation } from "react-i18next";

function Statistics() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = "/users";
        if (!endpoint) return;
        const res = await axiosInstance.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="statistics">
      <div className="statistics-container">
        <div className="statCatContaner">
          <h2>{t("statistics.title")}</h2> {/* Ключ: "statistics.title" */}
          <div className="statCatWidget">
            <div className="statCatList">
              {data.length > 0 ? (
                data.map((item, index) => {
                  if (!item) return null;

                  return (
                    <div key={index} className="list-item">
                      <div
                        className="statCatCard"
                        onClick={() => setSelectedItem(item)} // Зберігаємо вибраний об'єкт
                      >
                        <div className="statCard1">{item.name}</div>
                        <img
                          className="statCard5"
                          src={item.img}
                          alt={item.name || t("statistics.imageAlt")} // Ключ: "statistics.imageAlt"
                        />
                        <div className="statCard">{item.email}</div>
                        <div className="statCard">{item.phone}</div>
                        <div className="statCard">{item.job_name}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>{t("statistics.noData")}</p> // Ключ: "statistics.noData"
              )}
            </div>
          </div>

          <div className="charts">
            <Graphs selectedItem={selectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;