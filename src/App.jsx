import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./style.css"
import Projects from './pages/Projects';
import Add from './pages/Add';
import Update from './pages/Update';

function App() {
  return (
    <div className="App">
      
    <BrowserRouter>
      
      
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/add" element={<Add />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;



