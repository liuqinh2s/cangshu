// pages/index/index.js
const app = getApp();

Page({
  data: {
    websites: [],
    searchKeyword: '',
    page: 1,
    pageSize: 10,
    hasMore: true,
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
    // 已登录，加载网站列表
    this.loadWebsites();
  },

  // 加载网站列表
  loadWebsites: function(refresh = false) {
    if (this.data.loading) return;

    this.setData({
      loading: true
    });

    if (refresh) {
      this.setData({
        page: 1,
        hasMore: true,
        websites: []
      });
    }

    wx.request({
      url: app.globalData.apiBaseUrl + '/websites',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: this.data.searchKeyword
      },
      success: res => {
        if (res.data.success) {
          const websites = res.data.data.websites;
          const total = res.data.data.total;

          this.setData({
            websites: refresh ? websites : this.data.websites.concat(websites),
            page: this.data.page + 1,
            hasMore: this.data.page * this.data.pageSize < total
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({
          loading: false
        });
      }
    });
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    // 防抖处理，延迟搜索
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadWebsites(true);
    }, 300);
  },

  // 加载更多
  onLoadMore: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadWebsites();
    }
  },

  // 跳转到详情页
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/website-detail/website-detail?id=' + id
    });
  },

  // 跳转到添加页面
  goToAdd: function() {
    wx.navigateTo({
      url: '/pages/add-website/add-website'
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadWebsites(true);
    wx.stopPullDownRefresh();
  }
});