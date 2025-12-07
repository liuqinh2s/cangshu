import axios from 'axios';
import { config } from '../utils/config';

// 创建axios实例
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
          // 禁止访问
          console.error('禁止访问:', data.message);
          break;
        case 404:
          // 资源不存在
          console.error('资源不存在:', data.message);
          break;
        case 500:
          // 服务器内部错误
          console.error('服务器错误:', data.message);
          break;
        default:
          console.error('请求错误:', data.message);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，没有收到响应');
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

// 导出API服务
export const authService = {
  // 微信登录
  wechatLogin: () => {
    window.location.href = config.WECHAT_LOGIN_URL;
  },
  // 验证token
  verifyToken: () => {
    return apiClient.get('/auth/verify');
  }
};

export const websiteService = {
  // 创建网站
  createWebsite: (data) => {
    return apiClient.post('/websites', data);
  },
  // 获取网站列表
  getWebsites: (params) => {
    return apiClient.get('/websites', { params });
  },
  // 获取单个网站
  getWebsite: (id) => {
    return apiClient.get(`/websites/${id}`);
  },
  // 更新网站
  updateWebsite: (id, data) => {
    return apiClient.put(`/websites/${id}`, data);
  },
  // 删除网站
  deleteWebsite: (id) => {
    return apiClient.delete(`/websites/${id}`);
  },
  // 点赞网站
  likeWebsite: (id) => {
    return apiClient.post(`/websites/${id}/like`);
  },
  // 取消点赞
  unlikeWebsite: (id) => {
    return apiClient.post(`/websites/${id}/unlike`);
  },
  // 收藏网站
  collectWebsite: (id) => {
    return apiClient.post(`/websites/${id}/collect`);
  },
  // 取消收藏
  uncollectWebsite: (id) => {
    return apiClient.post(`/websites/${id}/uncollect`);
  },
  // 获取收藏网站列表
  getCollections: () => {
    return apiClient.get('/websites/collections');
  }
};