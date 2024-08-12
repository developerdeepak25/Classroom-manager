import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/Auth/PublicRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Classroom from "./pages/Classrooms";
import ClassroomManager from "./pages/ClassroomManager";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classrooms" element={<Classroom />} />
          <Route path="classrooms/:classroomId" element={<ClassroomManager />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
