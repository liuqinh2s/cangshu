// pages/login/login.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },

  onLoad: function() {
    // 检查是否支持最新的getUserProfile API
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
  },

  // 使用最新的微信登录API
  getUserProfile: function(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // 调用登录接口
        this.login();
      }
    });
  },

  // 旧版登录方式（兼容）
  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      // 调用登录接口
      this.login();
    }
  },

  login: function() {
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后端换取 openId, sessionKey, unionId
          wx.request({
            url: app.globalData.apiBaseUrl + '/auth/wechat/login',
            method: 'POST',
            data: {
              code: res.code,
              userInfo: this.data.userInfo
            },
            success: response => {
              if (response.data.success) {
                // 登录成功，保存用户信息和token
                wx.setStorageSync('token', response.data.data.token);
                wx.setStorageSync('userInfo', response.data.data.user);
                app.globalData.userInfo = response.data.data.user;
                // 跳转到首页
                wx.switchTab({
                  url: '/pages/index/index'
                });
              } else {
                wx.showToast({
                  title: response.data.message || '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none'
          });
        }
      }
    });
  }
});