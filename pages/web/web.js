// pages/web/web.js
Page({

  data: {
    weburl:''
  },

  onLoad: function (opt) {
    console.log(opt.url)
     this.setData({
       weburl:opt.url
     })
     wx.showLoading({
       title: '加载中',
     })
  },
  load:function(){
    wx.hideLoading()
  }
  
})