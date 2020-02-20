//app.js
const url = 'https://xhsilkroad.5xing.com.cn'
const urlImg = 'https://xhsilkroad.5xing.com.cn/assets/mpimg'
App({
  onLaunch: function () {

  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    url: url,
    urlImg: urlImg,
    tips1:'加载中',
    tips2:'当前网络错误，请稍后重试！',
    tips3:'获取内容失败，请返回首页重试！'
  }
})