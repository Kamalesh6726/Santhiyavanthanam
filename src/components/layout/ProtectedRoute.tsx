import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
