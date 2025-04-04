import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavBar } from './NavBar';
import { AdminNavBar } from './AdminNavBar';

export const DynamicNavBar = () => {
  const { user } = useAuth();
  return user?.isAdmin ? <AdminNavBar /> : <NavBar />;
};