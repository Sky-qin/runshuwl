//index.js
import { Domain } from "../../util/common"
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function(options) {
    const { macAddress } = options;
    wx.setStorageSync('macAddress', macAddress)
  },

  onShow: function() {
    const _this = this;
    // 页面进行渲染时判断当前参数值进行开柜操作
    const macAddress = wx.getStorageSync('macAddress')
    const userId = wx.getStorageSync('userId')
    if(!macAddress || !userId) return
    _this.openedDoor(macAddress, userId)
  },

  scanQrCode() {
    const _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        const { path } = res;
        const macAddress = _this.getUrlParam(path, 'macAddress')
        const userId = wx.getStorageSync('userId')
        if (!macAddress) {
          wx.showToast({
            title: '获取二维码信息失败',
            icon: 'none',
            duration: 1500
          })
          return 
        }
        _this.openedDoor(macAddress, userId)    
      }
    })
  },

  openedDoor(macAddress, userId) {
    wx.showLoading({
      title: '开锁中...',
      mask: true
    })
    wx.request({
      method: "post",
      url: `${Domain}/wx/user/unlock`,
      data: { macAddress, userId },
      success (res) {
        wx.hideLoading()
        const { data } = res
        if (data && data.success) {
          wx.navigateTo({
            url: '../openedDoor/index',
          })
          wx.setStorageSync('macAddress', "")
        } else {
          wx.showToast({
            title: res.data && res.data.message || '开柜失败',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  getUrlParam(path, name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let params = path.substr(path.indexOf("?") + 1)
    let r = decodeURIComponent(params).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
})
