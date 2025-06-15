import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('userRole'); // check if userRole exists

  if (!isLoggedIn) {
    // if not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // if logged in, show the requested page
  return children;
}
