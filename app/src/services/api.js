import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，自动添加token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response && error.response.status === 401) {
      // 未授权，清除本地存储并跳转到登录页
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userInfo');
      // 这里可以触发导航到登录页的逻辑
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 微信登录
  wechatLogin: (code, userInfo) => {
    return apiClient.post('/auth/wechat/login', { code, userInfo });
  },
  // 验证token
  verifyToken: () => {
    return apiClient.get('/auth/verify');
  },
};

// 网站相关API
export const websiteApi = {
  // 获取网站列表
  getWebsites: (params = {}) => {
    return apiClient.get('/websites', { params });
  },
  // 获取网站详情
  getWebsiteDetail: (id) => {
    return apiClient.get(`/websites/${id}`);
  },
  // 添加网站
  addWebsite: (data) => {
    return apiClient.post('/websites', data);
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
};

// 评论相关API
export const commentApi = {
  // 获取网站评论
  getComments: (websiteId) => {
    return apiClient.get(`/websites/${websiteId}/comments`);
  },
  // 添加评论
  addComment: (websiteId, content) => {
    return apiClient.post(`/websites/${websiteId}/comments`, { content });
  },
  // 删除评论
  deleteComment: (commentId) => {
    return apiClient.delete(`/comments/${commentId}`);
  },
};

// 导出默认API
export default {
  auth: authApi,
  website: websiteApi,
  comment: commentApi,
};