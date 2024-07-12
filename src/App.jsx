import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./style.css"
import IndexPage from './pages/IndexPage';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Assignments from './pages/Assignments';
import AddProject from './pages/AddProject';
import AddTask from './pages/AddTask';
import AddUser from './pages/AddUser';
import AddAssignment from './pages/AddAssignment';
import UpdateProject from './pages/UpdateProject';
import UpdateTask from './pages/UpdateTask';
import UpdateUser from './pages/UpdateUser';
import UpdateAssignment from './pages/UpdateAssignment';




function App() {
  return (
    <div className="App">
      
    <BrowserRouter>
      
      
      <Routes>
        <Route path="/" element={<IndexPage />} />
        
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/add_project" element={<AddProject />} />
        <Route path="/add_task" element={<AddTask />} />
        <Route path="/add_user" element={<AddUser />} />
        <Route path="/add_assignment" element={<AddAssignment />} />
        <Route path="/update_project/:id" element={<UpdateProject />} />
        <Route path="/update_task/:id" element={<UpdateTask />} />
        <Route path="/update_user/:id" element={<UpdateUser />} />
        <Route path="/update_assignment/:id" element={<UpdateAssignment />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;



