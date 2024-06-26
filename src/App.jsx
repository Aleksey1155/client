// file App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import "./style.css"
import Books from './pages/Books';
import Add from './pages/Add';
import Update from './pages/Update';
import Task from './pages/Task';

function App() {
  return (
    <div className="App">
      
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/add" element={<Add />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/task" element={<Task />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;



