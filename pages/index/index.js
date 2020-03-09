//index.js
const app = getApp()
var clicks=0;
var heightShow=false;//省份列表高度
const animation = wx.createAnimation({ timingFunction: 'linear', duration: 300 })
const animation2 = wx.createAnimation({ timingFunction: 'linear', duration: 300 })
var cityName='-1';
Page({
  data: {
    isShareIt:false,
    shareBG:'',
    format : [],
    urlImg: app.globalData.urlImg,
    url:app.globalData.url,
    mapSrc: '',  // 地图,
    textSrc: '',   // 标题
    statusBarHeight: app.globalData.statusBarHeight,//顶部栏高度
    mapHeight:0,//地图移动框高度
    canIUse: wx.canIUse('button.open-type.share'),
    tips_show:true,//观看视频提示框是否显示
    provinces:[
      { name: '贵州', id: '1' },
      { name: '四川', id: '3' },
      { name: '广西', id: '6' },
      { name: '宁夏', id: '4' },
      { name: '新疆', id: '8' },
      { name: '安徽', id: '9' },
      { name: '江苏', id: '7' },
      { name: '上海', id: '5' }
    ],
    provinces_e: [
      { name: 'Guizhou', id: '1' },
      { name: 'Sichuan', id: '3' },
      { name: 'Guangxi', id: '6' },
      { name: 'Ningxia', id: '4' },
      { name: 'Xinjiang', id: '8' },
      { name: 'Anhui', id: '9' },
      { name: 'Jiangsu', id: '7' },
      { name: 'Shanghai', id: '5' }
    ],
    scroll:1,//选择城市滚动状态
    cityCurr:-1,//选择答题城市
    mapS:'1',//地图放大倍数
    mapX:'-140',//地图X轴方向
    mapY:'-200',//地图Y轴方向
    textList:['观看视频','获取提示','分享获奖','开始答题','观看新华丝路英文省情视频','获取相关提示信息'],
    list:[]
  },
  handleClickShare(e){
    console.log(e);
    if(e.currentTarget.dataset.id === '1'){
      this.setData({isShareIt:true});
    }else{
      this.setData({isShareIt:false});
    }
    
  },

  onLoad: function () {
      
      var lang = wx.getStorageSync('language');  // 语言
      if(lang == 'cn') {
        this.setData({
          mapSrc: this.data.urlImg + '/images/map2.png',  // 地图,
          textSrc: this.data.urlImg + '/images/indexText.png',   // 标题
        })
      } else {
        this.setData({
          mapSrc: this.data.urlImg + '/images/enmap.png',  // 地图,
          textSrc: '/images/title.png',   // 标题
        })
      }
      
  },
  init(){
    let that = this;
    let shareBG ='';
    // 分享
    wx.showShareMenu({
      withShareTicket:true
    });
   
    const token = wx.getStorageSync('token');
    const language = wx.getStorageSync('language');
    wx.request({
      url: app.globalData.url+'/api/provice',
      method: 'GET',
      header: {
        token: token
      },
      success(res){
        res = res.data;
        if(res.code === 1){
          let list = res.data.rows;
          let leng = Math.ceil(list.length/9);//循环次数
          let format = [[],[]]
          list.forEach(item=>{
            if(language === 'cn'){
              item.name = item.cnprovice;
              shareBG =that.data.url+'/assets/img0306/share-en.jpg';
            }else{
              item.name = item.enprovice;
              shareBG =that.data.url+'/assets/img0306/share-cn.jpg';
            }
          });
          let k = 0;
          for(let i = 0 ; i<leng;i++){
            for(let j = 0;j<9;j++){
              format[i][j] = list[k];
              k++;
            }
          }
          that.setData({list,format,shareBG});
          console.log(list,format);

        }
      },
      fail(e){
        wx.showToast({
          title: app.globalData.tips2,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onShow:function(){
    this.init();
    if (heightShow){
      this.height_hide()
    }
    const lang = wx.getStorageSync('language')
    const username = wx.getStorageSync('username')
    const token = wx.getStorageSync('token')
    if (lang == '' || username == '' || token == '') {
      wx.hideLoading()
      //跳转授权页面
      wx.navigateTo({
        url: '/pages/author/author',
      })

    } else {
      wx.showLoading({
        title: app.globalData.tips1,
        mask: 'true'
      })
      var that = this
      that.getConHeight()//中间内容高度
      if (lang == 'en') {
        wx.setTabBarItem({
          index: 0,
          text: 'Challenge Time',
        })
        wx.setTabBarItem({
          index: 1,
          text: 'My Score',
        })
        that.setData({
          textList: ['Watch video', 'Get Hints', 'Share & Lucky Draw', 'start', 'Watch the Xinhua silk road video for tips', ''],
          provinces: that.data.provinces_e
        })
      }else{
        wx.setTabBarItem({
          index: 0,
          text: '我要挑战',
        })
        wx.setTabBarItem({
          index: 1,
          text: '我的战绩',
        })
      }
    }
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      const titList1 = ['轻松答题，了解中国省情！', '魅力中国，等你来发现！', '我正在参加魅力中国知识竞答，快来加入我们吧！']
      const titList2 = ['Fun contest to learn about sChinese provinces！', 'Charming China, waiting for you to discover！', 'This Charming China Quiz is so much fun, come and join us!']
      const lang = wx.getStorageSync('language')
      const index = Math.round(Math.random() * 2)
      if (lang == 'en') {
        var title = titList2[index]
      } else {
        var title = titList1[index]
      }
      this.getAddnumber()
    }
    return {
      title: title,
      path: '/pages/login/login'
    }
    
  },
  //转发增加抽奖次数
  getAddnumber:function(){
    const token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.url+'/api/prize/share',
      method: 'POST',
      header: {
        token: token
      },
      success(res){
      },
      fail(e){
        wx.showToast({
          title: app.globalData.tips2,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 设置地图移动框高度
  getConHeight:function(){
    const that=this;
    const query = wx.createSelectorQuery()
    query.select('.content').boundingClientRect()
    query.select('.title').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      const h = parseInt(res[0].height) - parseInt(res[1].height) - parseInt(115)
      that.setData({
        mapHeight: h
      })
      setTimeout(()=>{
        wx.hideLoading()
      },100)
    })
  },
  //显示提示窗
  tipsShow:function(){
    var that=this
    clicks++
    if(clicks==1){
        that.setData({
          tips_show: false
        })
        that.opacity_show()
        setTimeout(() => {
          that.opacity_hide()
        }, 3000)
        setTimeout(() => {
          that.setData({
            tips_show: true
          })
          clicks = 0
        },3400)
    }else{
      wx.showToast({
        title: '请勿连续点击！',
        icon: 'none',
        duration: 1500
      })
    }
    
  },
  // 提示显示动画
  opacity_show:function(){
    const that=this
    animation.opacity(1).step()
    that.setData({
      animationData: animation.export(),
      tips_show: false
    })
  },
  // 提示隐藏动画
  opacity_hide: function () {
    const that = this
    animation.opacity(0).step()
    that.setData({
      animationData: animation.export(),
      tips_show: true
    })
  },
  // 显示，隐藏城市
  Cityshow:function(){
    if(heightShow){
      this.height_hide()
    }else{
      this.height_show()
    }
  },
  //选择答题城市
  sel_City:function(e){
    cityName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/answer/answer?city='+cityName
    });
  },
  //开始答题
  answer:function(){
    const that=this
    wx.navigateTo({
      url: '/pages/answer/answer?city='+cityName
    })
  },
  // 选择城市滚动到顶部
  scroll1: function () {
    this.setData({
      scroll: 1
    })
  },
  // 选择城市滚动到底部
  scroll2: function () {
    this.setData({
      scroll: 2
    })
  },
  //观看视频
  lookvideo: function (e) {
    wx.navigateTo({
      url: '/pages/videoCity/videoCity',
    })
    if (heightShow) {
      this.height_hide()
    }
  },


  //点击保存图片
 save (e) {
  let that = this;
  let urlImg = e.currentTarget.dataset.url;
  //若二维码未加载完毕，加个动画提高用户体验
  //判断用户是否授权"保存到相册"
  wx.getSetting({
   success (res) {
    //没有权限，发起授权
    if (!res.authSetting['scope.writePhotosAlbum']) {
     wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success () {//用户允许授权，保存图片到相册
        wx.showLoading({
          title: 'saving...',
        })
       that.savePhoto(urlImg);
      },
      fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
        wx.showToast({
          title: 'fail!',
          icon:'none'
        });
       wx.openSetting({
        success () {
         wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.showToast({
              icon: 'loading',
              duration: 1000
             });
           that.savePhoto();
          }
         })
        }
       })
      }
     })
    } else {//用户已授权，保存到相册
      wx.showLoading({
        title: 'saving...',
      })
     that.savePhoto(urlImg)
    }
   }
  })
 },
//保存图片到相册，提示保存成功
 savePhoto() {
  let that = this
  wx.downloadFile({
   url: that.data.shareBG,
   success: function (res) {
    wx.saveImageToPhotosAlbum({
     filePath: res.tempFilePath,
     success(res) {
      wx.hideLoading()
      wx.showToast({
       title: 'success',
       icon: "success",
       duration: 1000
      });
      that.setData({isShareIt:false})
     },
     fail(){
      wx.hideLoading()
     }
    })
   },
   fail(){
    wx.hideLoading()
   }
  })
 }





})
