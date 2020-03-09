//index.js
const app = getApp()

Page({
  data: {
    urlImg: app.globalData.urlImg,
    statusBarHeight: app.globalData.statusBarHeight,//顶部栏高度
    language:wx.getStorageSync('language'),
    title:[]
  },
  handleClickPush(){
    wx.checkSession({
      success() {
        // 跳转index
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      fail() {
        //跳转授权页面
        wx.navigateTo({
          url: '/pages/author/author',
        })
      }
    })
  },
  onLoad: function () {
     
  },
  init(){
    let language = wx.getStorageSync('language');
    let that = this,title=[];
    if(language == 'en'){
      title[0] = 'Free answer questions, Free lottery, Chance to draw the business evaluation report provided by Xinhua silk road.';
      title[1] = 'Start';
      title[2] = 'The Charming China Quiz is an interactive game designed by Xinhua Silk Road. Players can lean about the economy and culture of China\'s provinces and cities.';
    }else{
      title[0] = '免费答题，免费抽奖，有机会抽中新华丝路提供的商业评估报告。';
      title[1] = '开始挑战';
      title[2] = '新华丝路省情答题小程序是新华丝路为广大用户更多了解中国各省市的经济、人文等情况而设计的互动游戏，等一起来挑战！';
    }
    that.setData({title});
  },
  onShow:function(){
    this.init();
  },
  // 转发
  onShareAppMessage: function (res) {
    
    
  },
  
})
