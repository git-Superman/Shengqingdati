//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    sel_but:'0',
    urlImg: app.globalData.urlImg
  },
  getSelected:function(e){
    const id = e.currentTarget.dataset.id
    this.setData({
      sel_but:id
    })
    if(id=='en'){
      app.globalData.tips1='Loading'
      app.globalData.tips2='The current network error, please try again later!'
      app.globalData.tips3='Failed to get the content, please go back to the home page and try again!'
    }
    wx.setStorage({
      data: id,
      key: 'language',
      success(){
        wx.getStorage({
          key: 'token',
          success(){
            wx.switchTab({
              url: '/pages/index/index',
            });
          },
          fail(){
            wx.redirectTo({
              url: '/pages/about/index',
            })
          }
        })
        
      }
    })
    // wx.setStorageSync("language", id);
    
    // wx.checkSession({
    //   success() {
    //     // 跳转index
    //     wx.switchTab({
    //       url: '/pages/index/index',
    //     })
    //   },
    //   fail() {
    //     //跳转授权页面
    //     wx.navigateTo({
    //       url: '/pages/author/author',
    //     })
    //   }
    // })
  }
})
