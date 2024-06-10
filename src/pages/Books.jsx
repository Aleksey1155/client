import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Імпорт компоненту Link

const Books = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/books");
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllBooks();
    }, []);

    const handleDelete = async (id)=>{

        try{
            await axios.delete("https://backend-ecqm.onrender.com/books/" + id)
            window.location.reload()
        }catch{
            console.log(err)
        }
    }

    return (
        <div>
            <h2> MY new Books</h2>
            <div className="books">
                {books.map(book => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={book.cover} alt="" />}
                        <h2>{book.title}</h2>
                        <p>{book.descr}</p>
                        <span>{book.price}</span>
                        <button className="delete" onClick={()=>handleDelete(book.id)}>Delete</button>
                        <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
                    </div>
                ))}
                
            </div>
            
            <button>
                <Link to="/add">Add new book</Link>
            </button>
        </div>
    );
}

export default Books;
