var app = getApp()
Page({

  data: {
    prizeName: '',  // 奖品名称
    imglist: ['https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b_award_bg.png', 'https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b_add_msg.png'],
    text1: '请输入您的姓名',   // 姓名 placeholder
    text2: '请输入您的邮箱',  // 邮箱 placeholder
    text3: '提交',  // 按钮
    name: '',  // 姓名
    email: ''   // 邮箱
  },
  onLoad: function (options) {
   console.log(options.prizeName.replace(/\$/,'&'));
    this.setData({
      prizeName: options.prizeName.replace(/\$/g,'&')
    })
    const lang = wx.getStorageSync('language')
    if (lang == 'en') {
      wx.setNavigationBarTitle({
        title: 'Congratulations'
      })
      this.setData({
        imglist: ['https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b_award_bg2.png', 'https://xhsilkroad.5xing.com.cn/assets/mpimg/images/b_add_msg2.png'],
        text1: 'Please enter your name',
        text2: 'Enter your phone Email',
        text3: 'Submit'
      })
    }
  },
  // 姓名的输入
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 邮件的输入
  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  // 点击提交
  clickBtn: function () {
    var that = this;
    var username = that.data.name;  // 姓名
    var useremail = that.data.email;   // 邮箱
    var lang = wx.getStorageSync('language');  // 语言
    // 校验姓名
    if (username == "" || username == null || username == undefined) {
      // 判断是否为中文
      if (lang == 'cn') {
        wx.showToast({
          title: '请输入您的姓名',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: 'Please enter your name',
          icon: 'none',
          duration: 2000
        })
      }
      return;
    }

    // 校验邮箱
    if (useremail == "" || useremail == null || useremail == undefined) {
      // 判断是否为中文
      if (lang == 'cn') {
        wx.showToast({
          title: '请输入您的邮箱',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: 'Enter your phone Email',
          icon: 'none',
          duration: 2000
        })
      }
      return;
    }

    wx.request({
      url: app.globalData.url + '/api/prize/regiser',
      method: 'post',
      dataType: 'json',
      data: {
        truename: username,
        email: useremail
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 1) {
          if (lang == 'cn') {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: 'Submitted successfully',
              icon: 'none',
              duration: 2000
            })
          }
         // 跳转到抽奖界面
         setTimeout(function() {
           wx.navigateTo({
             url: "/pages/draw/draw"
           })
         }, 3000)

        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })

  }

})