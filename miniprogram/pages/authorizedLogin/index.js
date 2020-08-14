//index.js
import { Domain } from "../../util/common"

const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {},

  getPhoneNumber (e) {
    const { detail } = e;
    const sessionId = wx.getStorageSync('sessionId')
    const openId = wx.getStorageSync('openId')

    wx.showLoading({
      title: '正在授权登录...',
      mask: true
    })
    wx.request({
      method: "post",
      url: `${Domain}/wx/user/bindAuth`,
      data: {
        sessionId,
        openId,
        ...detail
      },
      success (res) {
        const { data } = res
        const macAddress = wx.getStorageSync('macAddress')
        if (data && data.success) {
          const { id: userId } = data.data
          wx.setStorageSync('userId', userId)

          if (!macAddress) {
            wx.navigateTo({
              url: '../openDoor/index',
            })
            return;
          }
          wx.request({
            method: "post",
            url: `${Domain}/wx/user/unlock`,
            data: {
              macAddress,
              userId
            },
            success (res) {
              const { data } = res
              if (data && data.success) {
                wx.redirectTo({
                  url: '../openedDoor/index',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data && res.data.message || '授权异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
})
