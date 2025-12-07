import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import AddWebsitePage from '../pages/AddWebsitePage';
import WebsiteDetailPage from '../pages/WebsiteDetailPage';
import UserPage from '../pages/UserPage';
import { useUser } from '../context/UserContext';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div>加载中...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 路由配置
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/add-website" 
        element={
          <ProtectedRoute>
            <AddWebsitePage />
          </ProtectedRoute>
        } 
      />
      <Route path="/website/:id" element={<WebsiteDetailPage />} />
      <Route 
        path="/user" 
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};