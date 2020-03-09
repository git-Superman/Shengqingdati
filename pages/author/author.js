// pages/author/author.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlImg: app.globalData.urlImg,
    // 判断小程序的API，回调，参数组件等在当前版本是否可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgSrc: 'logo2.png',
    context: [],
    text:'',
    context_cn: [
      '温馨提示',
      '新华丝路小程序申请获取您的用户信息（头像、昵称）',
      '确认授权',
      '请升级微信版本'
    ],
    context_en: [
      'Reminder',
      'Xinhua Silk Road applet would like to obtain your user information (profile photo, user name)',
      'Confirmation of authorization',
      'Please upgrade the Wechat version'
    ],
    //中英文切换变量渲染
    publicP: '', //中英文提示语 
  },
  onShow: function() {
    var that = this
    var text = that.data.text;
    const language = wx.getStorageSync('language')
    if (language == 'en') {
      that.data.context = that.data.context_en;
      text = 'The Charming China Quiz is an interactive game designed by Xinhua Silk Road. Players can learn about the economy and culture of China\'s provinces and cities.';
    } else {
      that.data.context = that.data.context_cn;
      text = '新华丝路省情答题小程序是新华丝路为广大用户更多了解中国各省市的经济、人文等情况而设计的互动游戏，等一起来挑战！';
    }
    that.setData({
      context: that.data.context,
      text
    })
  },
  // 授权弹框
  bindGetUserInfo(e) {

    var that = this;
    if (!e.detail.userInfo) { // 用户点击拒绝
      wx.redirectTo({
        url: '/pages/login/login',
      })
    } else {
      wx.showLoading({
        title: app.globalData.tips1,
        mask: 'true'
      })
      const uencr = e.detail.encryptedData
      const uiv = e.detail.iv
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.request({
              url: app.globalData.url + '/api/user/mplogin',
              method: 'POST',
              dataType: 'json',
              header: {
                'content-type': 'application/json' // 默认值
              },
              data: {
                code: res.code,
                encryptedData: encodeURIComponent(uencr),
                iv: uiv
              },
              success(res) {
                if (res.data.code == 1) {
                  const data = res.data.data
                  wx.setStorageSync('username', data.userinfo.username)
                  wx.setStorageSync('token', data.userinfo.token)
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                  wx.hideLoading()
                }
              },
              fail() {
                wx.showToast({
                  title: app.globalData.tips2,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }
        }
      })

    }
  },
})