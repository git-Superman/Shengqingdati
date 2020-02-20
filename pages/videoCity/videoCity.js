// pages/videoCity/videoCity.js
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//顶部栏高度
    urlImg: app.globalData.urlImg,
    curr:-1,
    cityList:[
      //   {name:'贵州省',link:'https://www.baidu.com/'},
      //   {name:'四川省',link:'https://www.baidu.com/'},
      //   {name:'广西壮族自治区',link:'https://www.baidu.com/'},
      //   {name:'宁夏回族自治区',link:'https://www.baidu.com/'},
      //   {name:'新疆维吾尔自治区',link:'https://www.baidu.com/'},
      //   {name:'安徽省',link:'https://www.baidu.com/'},
      //   {name:'江苏省',link:'https://www.baidu.com/'},
      //   {name:'上海市',link:'https://www.baidu.com/'}
       ],
    city_e: [
      // { name: 'Guizhou', link: 'https://www.baidu.com/' },
      // { name: 'Sichuan', link: 'https://www.baidu.com/' },
      // { name: 'Guangxi Zhuang Autonomous Region', link: 'https://www.baidu.com/' },
      // { name: 'Ningxia Hui Autonomous Region', link: 'https://www.baidu.com/' },
      // { name: 'Xinjiang Uygur Autonomous Region', link: 'https://www.baidu.com/' },
      // { name: 'Anhui', link: 'https://www.baidu.com/' },
      // { name: 'Jiangsu', link: 'https://www.baidu.com/' },
      // { name: 'Shanghai', link: 'https://www.baidu.com/' }
    ],
    text1:'观看新华丝路英文省情视频，点击省份获取相关提示信息',
    text2:'请选择城市',
    text3:'挑战答题',
    text4:'我的战绩'
  },

  onLoad: function (options) {
    const that=this
    const lang = wx.getStorageSync('language');
    const token = wx.getStorageSync('token');
    if (lang == 'en') {
      that.setData({
        cityList: that.data.city_e,
        text1:'Watch Xinhua Silk Road\'s provincial business environment assessment videos to get hints!',
        text2:'Select City',
        text3: 'Challenge',
        text4: 'My Score'
      })
    }

    // 获取视频链接
    that.getLink();
  },
  // 获取视频地址
  getLink: function () {
    const that = this; 
    const token = wx.getStorageSync('token') 
    // 获取视频链接
    wx.request({
      url: app.globalData.url + '/api/provice',
      method: 'get',
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: function (res) {
        const data = res.data;
        if (data.code == 1) {
          const new_data = data.data.rows;
          const lang = wx.getStorageSync('language');  // 语言
          const cn_city = [], en_city = [];

          for (var i = 0; i < new_data.length; i++) {
            if (lang == 'cn') {  // 中文
              cn_city.push({
                name: new_data[i].cnprovice,
                link: new_data[i].link
              })
              // 赋值
              that.setData({
                cityList: cn_city
              })
            } else {  // 英文
              en_city.push({
                name: new_data[i].enprovice,
                link: new_data[i].link
              })
              that.setData({
                cityList: en_city
              })
            }
          }
        } else {
          wx.showToast({
            title: app.globalData.tips3,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(e) {
        wx.showToast({
          title: app.globalData.tips2,
          icon: 'none',
          duration: 2000
        })
      }
    })
  
  },
  // 跳转视频页面
  webVideo:function(e){
    var url = e.currentTarget.dataset.url
    console.log(url)
    this.setData({
      curr:e.currentTarget.dataset.index
    })
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/web/web?url=' + url,
      })
    },300)
  },
  // 跳转首页
  tab1:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //跳转我的战绩
  tab2: function () {
    wx.switchTab({
      url: '/pages/myRecord/myRecord',
    })
  },
})