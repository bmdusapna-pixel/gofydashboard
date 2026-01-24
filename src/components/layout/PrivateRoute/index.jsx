import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = sessionStorage.getItem("adminToken");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
