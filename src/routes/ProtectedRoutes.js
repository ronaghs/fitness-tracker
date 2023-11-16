import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

function ProtectedRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the auth state changes
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Loading indiciator while waiting for auth check
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/signin" />;
}

export default ProtectedRoutes;
