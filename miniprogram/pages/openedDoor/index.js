//index.js
const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo
  },

  onLoad: function() {
    // 获取用户信息
  },

  onShow: function() {
    const { userInfo } = app.globalData
  },

})
