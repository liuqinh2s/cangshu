// pages/website-detail/website-detail.js
const app = getApp();

Page({
  data: {
    websiteId: '',
    website: {},
    comments: [],
    commentContent: '',
    loading: false
  },

  onLoad: function(options) {
    const websiteId = options.id;
    if (!websiteId) {
      wx.navigateBack();
      return;
    }

    this.setData({
      websiteId: websiteId
    });

    // 加载网站详情
    this.loadWebsiteDetail();
    // 加载评论
    this.loadComments();
  },

  // 加载网站详情
  loadWebsiteDetail: function() {
    wx.request({
      url: app.globalData.apiBaseUrl + '/websites/' + this.data.websiteId,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: res => {
        if (res.data.success) {
          // 格式化日期
          const website = res.data.data;
          website.createdAt = this.formatDate(website.createdAt);
          this.setData({
            website: website
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  // 加载评论
  loadComments: function() {
    wx.request({
      url: app.globalData.apiBaseUrl + '/websites/' + this.data.websiteId + '/comments',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: res => {
        if (res.data.success) {
          const comments = res.data.data;
          // 格式化日期
          comments.forEach(comment => {
            comment.createdAt = this.formatDate(comment.createdAt);
          });
          this.setData({
            comments: comments
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载评论失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换点赞状态
  toggleLike: function() {
    const url = this.data.website.isLiked ? 
      `${app.globalData.apiBaseUrl}/websites/${this.data.websiteId}/unlike` : 
      `${app.globalData.apiBaseUrl}/websites/${this.data.websiteId}/like`;

    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: res => {
        if (res.data.success) {
          this.setData({
            'website.isLiked': !this.data.website.isLiked,
            'website.likeCount': this.data.website.isLiked ? 
              this.data.website.likeCount - 1 : 
              this.data.website.likeCount + 1
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换收藏状态
  toggleCollection: function() {
    const url = this.data.website.isCollected ? 
      `${app.globalData.apiBaseUrl}/websites/${this.data.websiteId}/uncollect` : 
      `${app.globalData.apiBaseUrl}/websites/${this.data.websiteId}/collect`;

    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: res => {
        if (res.data.success) {
          this.setData({
            'website.isCollected': !this.data.website.isCollected,
            'website.collectionCount': this.data.website.isCollected ? 
              this.data.website.collectionCount - 1 : 
              this.data.website.collectionCount + 1
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    });
  },

  // 打开网站
  openWebsite: function() {
    wx.navigateToMiniProgram({
      appId: '', // 如果是小程序内部跳转需要appId，否则用web-view
      path: '',
      fail: () => {
        // 如果跳转失败，使用web-view打开
        wx.navigateTo({
          url: '/pages/web-view/web-view?url=' + encodeURIComponent(this.data.website.url)
        });
      }
    });
  },

  // 评论输入
  onCommentInput: function(e) {
    this.setData({
      commentContent: e.detail.value
    });
  },

  // 提交评论
  submitComment: function() {
    if (!this.data.commentContent.trim()) {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: app.globalData.apiBaseUrl + '/websites/' + this.data.websiteId + '/comments',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        content: this.data.commentContent
      },
      success: res => {
        if (res.data.success) {
          // 清空输入框
          this.setData({
            commentContent: ''
          });
          // 重新加载评论
          this.loadComments();
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        });
      }
    });
  },

  // 格式化日期
  formatDate: function(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return minutes + '分钟前';
    } else if (hours < 24) {
      return hours + '小时前';
    } else if (days < 7) {
      return days + '天前';
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year + '-' + month + '-' + day;
    }
  }
});