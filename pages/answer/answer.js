// pages/answer/answer.js
const app = getApp();
var click_sel=true;//判断是否已经选择选项
var valHandle;  //定时器
const ctx = wx.createCanvasContext('progress')
var city='0';
Page({
  data: {
    showview:true,//页面是否显示（加载是否完毕数据）
    urlImg: app.globalData.urlImg,
    seconds:20,//倒计时秒数
    // answerBg: app.globalData.urlImg+'/images/answerBg.png',//页面背景地图
    answerBg: '',//页面背景地图
    checkImg: app.globalData.urlImg +'/images/check.png',//对
    wrongImg: app.globalData.urlImg +'/images/wrong.png',//错
    sNumber:1,//题目序号
    sTotal:1,//题目总数
    conTopic:{},//当前答题题目信息
    conList:'0',//所有题目数组
    answer:'0',//当前题目答案
    current:'-1',//点击项
    currentbg:'-1',//点击项背景颜色
    checkbgShow:false,//正确项背景色隐藏显示
    checkbg:'checkImg',//正确项背景颜色

    complete:false,//是否完成答题
    correct:0,//答对数量
    error:0,//错误数量
    fraction:0,//分数
    textlist:['第','关','恭喜你, 完成答题！','回答正确/道','回答错误/道','观看新华丝路省情视频','返回首页','分']
  },
  onLoad:function(opt){
    var that = this
    city = opt.city
    const lang = wx.getStorageSync('language')
    if (lang == 'en') {
      wx.setNavigationBarTitle({
        title: 'Challenge Time'
      })
      that.setData({
        textlist: ['Question', '', 'Congratulations! You\'ve completed!', 'Correct answers', 'Wrong answers', 'Watch Xinhua Silk Road short video','Return to homepage','points']
      })
    }
    that.getSubject()
    wx.showLoading({
      title: app.globalData.tips1,
      mask: 'true'
    })
  },
  onShow:function(){
    var that = this
    // that.progress()
  },
  // 获取题目
  getSubject: function () {
    var that = this
    const token=wx.getStorageSync('token')
    const language = wx.getStorageSync('language')
    wx.request({
        url: app.globalData.url + '/api/question',
        method: 'GET',
        dataType: 'json',
        header:{
          token: token
        },
        data: {
          pid:city,
          lang: language
        },
        success(res) {
            if(res.data.code==1){
                  const data = res.data.data
                  that.setData({
                    conList: data.rows,//题目数组
                    conTopic: data.rows[0],//第一题
                    answer: data.rows[0].answer,//第一题正确答案
                    sTotal: data.total,//题目总数
                    showview:false,//数据加载完毕页面显示内容
                    answerBg: data.cover
                  })
                  that.progress()
                  wx.hideLoading()
            }else{
              wx.showToast({
                title: app.globalData.tips3,
                icon: 'none',
                duration: 2000
              })
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
  },
  // 倒计时canvas、显示当前题目信息
  progress:function(){
    ctx.setLineWidth(4)
    ctx.setLineCap('round')
    ctx.arc(32, 32, 25,  1.5 * Math.PI, -0.5 * Math.PI, true)
    ctx.setStrokeStyle('#4190fa')
    ctx.stroke()
    ctx.draw()
    this.startTime()
  },
  // 倒计时开始
  startTime:function(){
      var that = this
      // that.data.seconds = 20 //重新设置一遍初始值，防止初始值被改变
      var step = that.data.seconds;  //定义倒计时
      var num = -0.5;
      var decNum = 2 / step / 10
      clearInterval(valHandle)

      function drawArc(endAngle) {
        ctx.setLineWidth(4)
        ctx.setLineCap('round')
        ctx.arc(32, 32, 25, 1.5 * Math.PI, endAngle, true)
        ctx.setStrokeStyle('#4190fa')
        ctx.stroke()
        ctx.draw()
      }

        valHandle = setInterval(function () {

        that.setData({
          seconds: parseInt(step)
        })
        step = (step - 0.1).toFixed(1)
        num += decNum
        drawArc(num * Math.PI)

        if (step <= 0) {
          clearInterval(valHandle)  //销毁定时器
          that.setData({
            error: parseInt(that.data.error) + 1,
            seconds:20
          })
          that.next()
        }

      }, 100)
  },
  //选择答案
  select:function(e){
      if(click_sel){ 
          click_sel=false
          const that=this;
          const num = e.currentTarget.dataset.num
          const index = e.currentTarget.dataset.index
          if(num == that.data.answer){
              that.setData({
                  current: index,
                  currentbg:'checkImg',
                  correct:parseInt(that.data.correct) +1
              })
          }else{
              that.setData({
                current: index,
                currentbg: 'wrongImg',
                checkbgShow:true,
                error: parseInt(that.data.error) + 1
              })
          }
          that.next()
      }else{
        return false
      }
  },
  // 跳转下一题
  next:function(e){
      const that=this
      var page = parseInt(that.data.sNumber)
      var total = that.data.sTotal
      var num = page
      if(page<total){
        page = page + 1
        setTimeout(() => {
            that.setData({
              conTopic: that.data.conList[num],
              answer: that.data.conList[num].answer,
              seconds: 20,//倒计时时间
              sNumber: page,//题目序号
              current: '-1',//点击项
              currentbg: '-1',//点击项背景颜色
              checkbgShow: false,//正确项背景色隐藏显示
            })
            click_sel = true
            that.progress()
        },500)
      }else{
         that.achievement()
      }
  },
  // 计算成绩，上传成绩
  achievement:function(e){
    const that = this
    const fraction=parseInt(that.data.correct)*20
    const token = wx.getStorageSync('token')
    const language = wx.getStorageSync('language')
    wx.request({
      url: app.globalData.url + '/api/achievement',
      method: 'POST',
      dataType: 'json',
      header: {
        token: token
      },
      data: {
        pid: city,
        score: fraction
      },
      success(res) {
        if(res.data.code==1){
          that.setData({
            complete: true,
            fraction: fraction
          })
          click_sel = true
        }
      },
      fail() {
        wx.showToast({
          title: '当前网络延迟，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
      
  },
  //观看视频
  lookvideo:function(e){
    wx.redirectTo({
      url: '/pages/videoCity/videoCity',
    })
  },
  // 返回首页
  return:function(e){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})