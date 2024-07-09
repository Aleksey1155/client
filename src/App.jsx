import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./style.css"
import Projects from './pages/Projects';
import UpdateProject from './pages/UpdateProject';
import AddProject from './pages/AddProject';

function App() {
  return (
    <div className="App">
      
    <BrowserRouter>
      
      
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/add_project" element={<AddProject />} />
        <Route path="/update/:id" element={<UpdateProject />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;



