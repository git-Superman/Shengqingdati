const app = getApp();
const drawList = [
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  },
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  },
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  },
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  },
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  },
  {
    drawCon: "",
    backFlip: 0,  // 背面
    frontFlip: 0,  // 前面
    prize: false,//是否有奖
  }
]
var language=false;
Page({

  data: {
    tit_img:'https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b-record-1.png',
    text1:'还可以免费抽奖',
    text2:'次',
    text3:'中奖记录',
    drawNumber: wx.getStorageSync('lotterytimes'), // 抽奖次数
    clickNum: 0,  // 点击次数
    isClick: true,  // 是否允许点击
    unClick: true,  // 允许点击
    drawList:'',
  },
  onLoad: function (options) {
    const lang = wx.getStorageSync('language')
    wx.showLoading({
      title: '加载中',
    }) 
    if (lang == 'en') {
      wx.showLoading({
        title: 'loading',
      }) 
      wx.setNavigationBarTitle({
        title: 'Lucky Draw'
      })
      this.setData({
        tit_img:'https://xhsilkroad.5xing.com.cn/assets/img/lucky-draw.png',
        text1:'lucky draws',
        text2:' left',
        text3:'Your Prizes'
      })
      language=true
    }
    this.setData({
      drawNumber: wx.getStorageSync('lotterytimes')
    })
  },
  onShow:function(){
    this.setData({
      drawList: drawList,
      clickNum:0,
      drawNumber: wx.getStorageSync('lotterytimes')
    })
  },
  onReady: function () {
    wx.hideLoading()
  },
  // 点击翻转抽奖
  clickFlip: function(event) {

    var that = this;
    var clickNum = that.data.clickNum;   // 点击次数
    var drawNumber = that.data.drawNumber;   // 抽奖次数
    var lang = wx.getStorageSync('language');  // 语言
    var token = wx.getStorageSync('token');  // token
    clickNum++;
    that.setData({
      clickNum: clickNum,
      unClick: false
    })

    if (clickNum == 1) {
      wx.request({
        url: app.globalData.url + '/api/prize',
        method: 'get',
        dataType: 'json',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 1) {
            var clickNum = that.data.clickNum;  // 点击次数
            var lang = wx.getStorageSync('language'); // 语言
            var drawNumber = data.data.lotterytimes;  // 抽奖次数
            wx.setStorageSync('lotterytimes', drawNumber)
            var data_prize = data.data.prize;
            var isFill = data_prize.isfill;  // 是否中奖 0：未中奖  1：中奖
            var cnname = data_prize.cnname;  // cn
            var enname = data_prize.enname;  // en
            that.setData({
              drawNumber: drawNumber
            })
            // drawNumber--;  // 抽奖次数递减
            // 判断是否有抽奖机会
            if (drawNumber > 0) { // 有抽奖机会
              // 翻转
              let currIndex = event.currentTarget.dataset.id;
              let new_drawList_Arr = that.data.drawList;
              const prize = event.currentTarget.dataset.prize;
              new_drawList_Arr[currIndex].backFlip = 1;
              new_drawList_Arr[currIndex].frontFlip = 2;

              // 判断是否中奖
              if (isFill != 0) {  // 中奖
                var prizeName = '';
                if (lang == 'cn') {
                  prizeName = data_prize.cnname;
                  new_drawList_Arr[currIndex].drawCon = prizeName;  // cn-中奖内容
                } else {
                  prizeName = data_prize.enname;
                  new_drawList_Arr[currIndex].drawCon = prizeName;  // en-中奖内容
                }
                that.setData({
                  drawList: new_drawList_Arr,
                  drawNumber: drawNumber
                })
                // 跳转到填写信息界面
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/addMsg/addMsg?prizeName=' + prizeName,
                    success: function () {
                      new_drawList_Arr[currIndex].backFlip = 0;
                      new_drawList_Arr[currIndex].frontFlip = 0;
                      new_drawList_Arr[currIndex].drawCon = '';
                      that.setData({
                        drawList: new_drawList_Arr,
                        clickNum: 0,
                        unClick: true
                      })
                    }
                  })
                }, 2000)
              } else { // 未中奖
                if (lang == 'cn') {  // 中文
                  new_drawList_Arr[currIndex].drawCon = data_prize.cnname;  // cn-中奖内容
                  that.setData({
                    drawList: new_drawList_Arr,
                    drawNumber: drawNumber
                  })
                  wx.showModal({
                    title: '未中奖',
                    content: '很遗憾~距离大奖只差一点点了~',
                    cancelText: '返回首页',
                    cancelColor: '#0faaff',
                    confirmText: '继续抽奖',
                    confirmColor: '#ff4c69',
                    success(res) {
                      if (res.confirm) {
                        new_drawList_Arr[currIndex].backFlip = 0;
                        new_drawList_Arr[currIndex].frontFlip = 0;
                        new_drawList_Arr[currIndex].drawCon = '';
                        that.setData({
                          drawList: new_drawList_Arr,
                          clickNum: 0,
                          unClick: true
                        })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
                } else {  // 英文
                  new_drawList_Arr[currIndex].drawCon = data_prize.enname;  // en-中奖内容
                  that.setData({
                    drawList: new_drawList_Arr,
                    drawNumber: drawNumber,
                    clickNum: 0,
                    unClick: true
                  })
                  wx.showModal({
                    title: 'Not winning',
                    content: 'Oops! Keep trying!',
                    cancelText: 'Home',
                    cancelColor: '#0faaff',
                    confirmText: 'Continue',
                    confirmColor: '#ff4c69',
                    success(res) {
                      if (res.confirm) {
                        new_drawList_Arr[currIndex].backFlip = 0;
                        new_drawList_Arr[currIndex].frontFlip = 0;
                        new_drawList_Arr[currIndex].drawCon = '';
                        that.setData({
                          drawList: new_drawList_Arr,
                          clickNum: 0,
                          unClick: true
                        })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
                }
              }
            } else {  // 没有抽奖机会
              // 判断是中文还是英文
              if (lang == 'cn') {  // cn
                wx.showToast({
                  title: '当前暂无抽奖次数！',
                  icon: 'none',
                  duration: 2000
                })
              } else {  // en
                wx.showToast({
                  title: 'Currently, there are no lottery times!',
                  icon: 'none',
                  duration: 2000
                })
              }
            }

          } else {
            var lang = wx.getStorageSync('language');
            if (lang == 'cn') {
              wx.showToast({
                title: '抱歉，请等待下次抽取奖品',
                icon: 'none',
                duration: 3000
              })
            } else {
              wx.showToast({
                title: "Oops! Sorry, you have no lucky draws left.",
                icon: 'none',
                duration: 3000
              })
            }
            // 设置可点击
            that.setData({
              unClick: true
            })
          }
        }
      })
    }
  },
  // 跳转中奖记录界面
  clickOpenHtml: function() {
    wx.navigateTo({
      url: '/pages/drawHistory/drawHistory',
    })
  }
})
