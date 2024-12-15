import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = ({loading,isAuthenticated}) => {
  
  

  

  // Wait for the authentication check to complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component
  return <Outlet />;
};

export default ProtectedRoutes;
