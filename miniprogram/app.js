//app.js
import { Domain } from "./util/common"

App({
  onLaunch: function (options) {
    // 登录
    wx.login({
      success: res => {
        wx.showLoading({
          title: '授权登录中...',
          mask: true
        })
        wx.setStorageSync('wxCode', res.code)
        wx.request({
          url: `${Domain}/wx/user/validAuth`,
          data: {
            wxCode: res.code
          },
          method: "POST",
          success (res) {
            const { data } = res;
            if (data && data.success) {
              const { auth, sessionId, id: userId, openId } = data.data;
              wx.hideLoading()
              wx.setStorageSync('sessionId', sessionId)
              wx.setStorageSync('userId', userId)
              wx.setStorageSync('openId', openId)
              if (!auth) {
                wx.redirectTo({
                  url: '../authorizedLogin/index',
                })
              }
            } else {
              wx.showToast({
                title: res.data && res.data.message || `登录异常，请重新进入小程序`,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
})
