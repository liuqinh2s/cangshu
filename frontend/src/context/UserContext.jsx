import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// 创建用户上下文
const UserContext = createContext(null);

// 用户上下文提供者组件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化用户信息
  useEffect(() => {
    const initUser = () => {
      // 从localStorage获取用户信息和token
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        // 验证token是否有效
        authService.verifyToken()
          .then(() => {
            setUser(JSON.parse(storedUser));
            setLoading(false);
          })
          .catch(() => {
            // token无效，清除用户信息
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
          });
      } else {
        // 检查URL参数是否有token和user信息（微信登录回调）
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userParam = params.get('user');

        if (token && userParam) {
          // 保存用户信息和token
          const userData = JSON.parse(userParam);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          // 清除URL参数
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // 登录方法
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // 登出方法
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // 更新用户信息
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义Hook，用于在组件中使用用户上下文
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser必须在UserProvider内部使用');
  }
  return context;
};