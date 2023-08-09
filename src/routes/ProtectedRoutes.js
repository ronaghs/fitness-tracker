import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

function ProtectedRoutes() {
  let user = auth?.currentUser?.email;

  console.log(user);

  return user ? <Outlet /> : <Navigate to="/signin" />;
}

export default ProtectedRoutes;
