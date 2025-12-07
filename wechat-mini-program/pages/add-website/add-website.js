// pages/add-website/add-website.js
const app = getApp();

Page({
  data: {
    formData: {
      title: '',
      url: '',
      description: '',
      tags: '',
      category: 0,
      isPublic: true
    },
    categories: ['工具', '设计', '前端', '后端', '移动开发', '资源', '教程', '其他'],
    loading: false
  },

  onLoad: function() {
    // 检查用户是否已登录
    const token = wx.getStorageSync('token');
    if (!token) {
      // 未登录，跳转到登录页
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
  },

  // 输入变化处理
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 分类选择变化处理
  onCategoryChange: function(e) {
    this.setData({
      'formData.category': e.detail.value
    });
  },

  // 公开设置开关变化处理
  onSwitchChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 表单提交
  submitForm: function(e) {
    const formData = this.data.formData;
    
    // 表单验证
    if (!formData.title.trim()) {
      wx.showToast({
        title: '请输入网站标题',
        icon: 'none'
      });
      return;
    }

    if (!formData.url.trim()) {
      wx.showToast({
        title: '请输入网站URL',
        icon: 'none'
      });
      return;
    }

    // 格式化数据
    const submitData = {
      ...formData,
      category: this.data.categories[formData.category],
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    this.setData({
      loading: true
    });

    // 提交表单
    wx.request({
      url: app.globalData.apiBaseUrl + '/websites',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'Content-Type': 'application/json'
      },
      data: submitData,
      success: res => {
        if (res.data.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
          // 返回首页
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.data.message || '添加失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({
          loading: false
        });
      }
    });
  }
});