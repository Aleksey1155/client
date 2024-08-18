import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import "./style.css";

import Projects from "./pages/project/Projects";
import Tasks from "./pages/task/Tasks";
import Users from "./pages/user/Users";
import Assignments from "./pages/assignment/Assignments";
import AddProject from "./pages/project/AddProject";
import AddTask from "./pages/task/AddTask";
import AddUser from "./pages/user/AddUser";
import AddAssignment from "./pages/assignment/AddAssignment";
import UpdateProject from "./pages/project/UpdateProject";
import UpdateTask from "./pages/task/UpdateTask";
import UpdateUser from "./pages/user/UpdateUser";
import UpdateAssignment from "./pages/assignment/UpdateAssignment";
import ProjectDetails from "./pages/project/ProjectDetails";
import TaskDetails from "./pages/task/TaskDetails";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import UserDetails from "./pages/user/UserDetails";
import UserDatatable from "./pages/user/UserDatatable";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layoutContainer">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/users/:id",
        element: <UserDetails />,
      },
      {
        path: "/update_user/:id",
        element: <UpdateUser />,
      },
      {
        path: "/add_user",
        element: <AddUser />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // {
  //   path: "/users/:id/datatable",
  //   element: <UserDatatable />,
  // }

 
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home/>} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/project/:id" element={<ProjectDetails />} />
//           <Route path="/task/:id" element={<TaskDetails />} />
//           <Route path="/tasks" element={<Tasks />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/assignments" element={<Assignments />} />
//           <Route path="/add_project" element={<AddProject />} />
//           <Route path="/add_task" element={<AddTask />} />
//           <Route path="/add_user" element={<AddUser />} />
//           <Route path="/add_assignment" element={<AddAssignment />} />
//           <Route path="/update_project/:id" element={<UpdateProject />} />
//           <Route path="/update_task/:id" element={<UpdateTask />} />
//           <Route path="/update_user/:id" element={<UpdateUser />} />
//           <Route path="/update_assignment/:id" element={<UpdateAssignment />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
