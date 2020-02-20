let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    imgList:['https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b-record-1.png','https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b_history-record.png'],
    text1:'当前还可以免费抽奖',
    text2: '次',
    text3:'分',
    drawNumber: '',   // 抽奖次数
    context:'暂无排名',
    // 历史战绩
    historyRecord: [], 
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    }) 
    var scroll_height = wx.getSystemInfoSync().screenHeight;
    scroll_height = scroll_height -130
    this.setData({
      height: scroll_height
    })  
    const lang = wx.getStorageSync('language')
    if (lang == 'en') {
      wx.setNavigationBarTitle({
        title: 'My Score'
      })
      this.setData({
        imgList:['https://xhsilkroad.5xing.com.cn/assets/img/lucky-draw.png','https://xhsilkroad.5xing.com.cn/assets/img/past-records.png'],
        text1:'Free lucky ',
        text2:' draw',
        text3:' points',
        text4:'No ranking',
        
      })
    }

    // 获取历史战绩
    this.getHistoryRecord()
  },
  onShow: function() {
    this.setData({
      drawNumber: wx.getStorageSync('lotterytimes')  // 更新次数
    })
    // 获取历史战绩
    this.getHistoryRecord()
  },
  onReady: function () {
    wx.hideLoading()
  },
  // 获取历史战绩
  getHistoryRecord() {
    let token = wx.getStorageSync("token");
    let that = this;
    wx.request({
      url: app.globalData.url + '/api/achievement/history',
      method: 'GET',
      dataType: 'json',
      data: {
        token: token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 1) {
          if (data.data != null || data.data != "null") {
            // 如果data不为null
            let drawNumber = data.data.lotterytimes;  // 抽奖次数
            wx.setStorageSync("lotterytimes", drawNumber);
            that.setData({
              drawNumber: drawNumber
            })
            let historyRecord = data.data.records;  // 历史战绩
            let lang = wx.getStorageSync('language');  // 语言
            let newHistory = [];  // 定义新的变量
            // 校验抽奖次数
            if (drawNumber == null || drawNumber == 'null' || drawNumber == undefined || drawNumber == ''){
              drawNumber = 0;
            }
           // 中奖次数赋值
            that.setData({
              drawNumber: drawNumber
            })
            
            // 判断是否为中文
            if(lang == 'cn') { // cn
              for (let i = 0; i < historyRecord.length; i++) {
                newHistory.push({
                  number: historyRecord[i].score,
                  place: historyRecord[i].cnprovice
                })
                // historyRecord 赋值-cn
                that.setData({
                  historyRecord: newHistory
                })
              }
             
            } else {  // en
              for (let i = 0; i < historyRecord.length; i++) {
                newHistory.push({
                  number: historyRecord[i].score,
                  place: historyRecord[i].enprovice
                })
                // historyRecord 赋值-en
                that.setData({
                  historyRecord: newHistory
                })
              }
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: app.globalData.tips3,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: app.globalData.tips2,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  jumpDraw:function(){
    wx.navigateTo({
      url: '/pages/draw/draw',
    })
  }
})
