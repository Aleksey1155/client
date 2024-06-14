import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
    const [selectedTable, setSelectedTable] = useState("books");
    const [tableData, setTableData] = useState([]);

    const handleSelectChange = (e) => {
        setSelectedTable(e.target.value);
        console.log(`Selected table: ${e.target.value}`); // Логування зміни вибору
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`Fetching data for table: ${selectedTable}`); // Логування перед запитом
                const res = await axios.get(`http://backend-ecqm.onrender.com/data/${selectedTable}`);
                console.log(res.data); // Логування отриманих даних
                setTableData(res.data);
            } catch (err) {
                console.error("Failed to fetch data", err); // Логування помилок
            }
        };

        fetchData();
    }, [selectedTable]);

    return (
        <div className="task">
            <h1>Task Page</h1>
            <p>DB select</p>
            <select name="db_name" onChange={handleSelectChange}>
                <option value="books">Books</option>
                <option value="users">Users</option>
            </select>

            <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
    );
}

export default Task;
