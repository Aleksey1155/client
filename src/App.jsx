import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
 
} from "react-router-dom";
import "./style.css";

import Projects from "./admin/adminPages/project/Projects";
import Tasks from "./admin/adminPages/task/Tasks";
import Users from "./admin/adminPages/user/Users";
import Assignments from "./admin/adminPages/assignment/Assignments";
import AddProject from "./admin/adminPages/project/AddProject";
import AddTask from "./admin/adminPages/task/AddTask";
import AddUser from "./admin/adminPages/user/AddUser";
import AddAssignment from "./admin/adminPages/assignment/AddAssignment";
import UpdateProject from "./admin/adminPages/project/UpdateProject";
import UpdateTask from "./admin/adminPages/task/UpdateTask";
import UpdateUser from "./admin/adminPages/user/UpdateUser";
import UpdateAssignment from "./admin/adminPages/assignment/UpdateAssignment";
import ProjectDetails from "./admin/adminPages/project/ProjectDetails";
import TaskDetails from "./admin/adminPages/task/TaskDetails";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Home from "./admin/adminPages/home/Home";
import UserDetails from "./admin/adminPages/user/UserDetails";
import UserDatatable from "./admin/adminPages/user/UserDatatable";
import LayoutAdmin from "./admin/adminPages/LayoutAdmin";   
import LayoutUser from "./pages/LayoutUser";   
import ImageCarousel from "./admin/adminComponents/carousel/ImageCarousel";
import Upload from "./admin/adminComponents/upload/Upload";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./admin/adminComponents/ProtectedRoute";


const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute component={LayoutAdmin} role="admin" />
    ),
    children: [
      
      {
        path: "/admin",
        element: <Home />,
      },
      {
        path: "/admin/users",
        element: <Users />,
      },
      
      {
        path: "/admin/users/:id",
        element: <UserDetails />,
      },
      {
        path: "update_user/:id",
        element: <UpdateUser />,
      },
      
      {
        path: "/admin/projects",
        element: <Projects />,
      },
      {
        path: "/admin/projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/admin/add_project",
        element: <AddProject />,
      },
      {
        path: "/admin/update_project/:id",
        element: <UpdateProject />,
      },
      {
        path: "/admin/add_user",
        element: <AddUser />,
      },
      {
        path: "/admin/tasks",
        element: <Tasks />,
      },
      {
        path: "/admin/assignments",
        element: <Assignments />,
      },
    ],
  },

  {
    path: "/",
    element: (
      <ProtectedRoute component={LayoutUser} role="user" />
    ),
    children: [
      {
        path: "/",
        element: <UserHome />,
      },

      {
        path: "/update_project/:id",
        element: <UpdateProject />,
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

  {
    path: "/upload",
    element: <Upload />,
  },
  

 
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



