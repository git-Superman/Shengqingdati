var app = getApp();
var noneData = '暂无数据';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeText: '',  // 中奖时间
    historyList: [],  // 中奖记录
    pages: 1,  // 当前页数
    total: 8,   // 每页显示多少条数据
    totalRows: 0,   // 总条数
    isRefreshing: false,  // 是否正在刷新
    isShow: true,   // 是否显示加载 
    scrollyHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = this.data.pages;  // 页数
    var total = this.data.total;  // 展示总数据
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollyHeight: res.windowHeight - 50
        })
      },
    })
   
    that.getHistory(pages, total);  // 获取中奖记录
   
    that.setData({
      timeText: '中奖时间：'
    })
    const lang = wx.getStorageSync('language')
    if (lang == 'en') {
      noneData = 'No data';
      that.setData({
        timeText: 'time: '
      })
      wx.showLoading({
        title: 'loading',
      })
      wx.setNavigationBarTitle({
        title: 'Your Prizes'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();  // 隐藏loading
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    var pages = this.data.pages;  // 页数
    var total = this.data.total;  // 显示总数量
    this.getHistory(pages, total) // 获取中奖记录
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   // console.log('上拉加载')
    this.setData({
      pages: this.data.pages+=8
    })
    var pages = this.data.pages;  // 分页
    var total = this.data.total;   // 总数
    var isRefreshing = this.data.isRefreshing;  // 是否正在刷新
    var lang = wx.getStorageSync('language');  // 语言
    
    if(lang == 'cn'){  // 中文
      wx.showLoading({
        title: '玩命加载中'
      })
    } else {
      wx.showLoading({
        title: 'loading'
      })
    }

   this.getHistory(pages,  total);  // 获取中奖记录
    
  },
  // 获取中奖记录
  getHistory: function(pages, total) {
    var that = this;
    var token = wx.getStorageSync('token');   // token
    var lang = wx.getStorageSync('language');  // 语言
    wx.request({
      url: app.globalData.url + '/api/prize/winrecord',
      method: 'get',
      dataType: 'json',
      data: {
        offset: pages,  // 展示几条数据
        limit: total   // 起始位置
      },
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        var data = res.data;
        if(data.code == 1) {
          
          if(data.data == '' || data.data == null) {
            wx.showToast({
              title: noneData,
              icon: 'none'
            })
          } else {
            var newData = [];  // 新的列表
            var rows = data.data.rows;
            // 获取总数据
            that.setData({
              totalRows: data.data.total
            })
            // 判断是否为中英文
            if(lang == 'cn') {  // 中文
              for (let i = 0; i < rows.length; i++) {
                newData.push({
                  name: rows[i].cnname,  // 中奖名称
                  time: rows[i].time   // 中奖时间
                })
              }
              //赋值
              that.setData({
                historyList: that.data.historyList.concat(newData)
              })
            
            } else {  // 英文
              for (let i = 0; i < rows.length; i++) {
                newData.push({
                  name: rows[i].enname,  // 中奖名称
                  time: rows[i].time   // 中奖时间
                })
              }
              //赋值
              that.setData({
                historyList: that.data.historyList.concat(newData)
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
      }
    })
  }
})