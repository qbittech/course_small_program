//index.js
const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    headImg: '',

    restNum: 0,
    groupNum: 0,
    oldPrice: 0,
    alonePrice: 0,
    groupPrice: 0,

    groupId: '',
    groupImg: '',
    groupName: '',
    groupClass: 'join-group',
    endTime: '',
    timeLeft: '',
    timer: '',

    teacherHeadImg: '',
    teacherIntroImg: '',
    teacherName: '',
    teacherPosition: '',

    courseImg: '',
    evaluateImg: '',
    footImg: '',

    showNotice: true,
    showTeacher: true,
    showAlone: true,

    swiperData: '',
    indicatorDots: false,
    system: '',
    isIOS: false
  },

  onLoad: function () {
    var _this = this;
    var token = wx.getStorageSync('token');

    // 获取系统信息
    // wx.getSystemInfo({
    //   success(res) {
    //     if (res.system.indexOf('iOS') != -1) {
    //       _this.setData({
    //         isIOS: true,
    //         system: res.system
    //       })
    //     }
    //   }
    // })
    
    if (token) {
      // 判断是否已经购买
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=isBuy',
        data: {
          token: token
        },
        success(res) {
          // if (res.data.data.status == 1) {
          //   wx.redirectTo({
          //     url: '/pages/payFinish/payFinish'
          //   })
          // }
        }
      })
    }

    // 设置倒计时
    this.data.timer = setInterval(() => {
      this.setData({
        timeLeft: util.getTimeLeft(this.data.endTime)
      });

      if (this.data.timeLeft == "00:00:00") {
        clearInterval(this.data.timer);
      }
    }, 1000);

    // 获取所有信息
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getAllinfo',
      success(res) {
        console.log('全部信息',res)
        _this.setData({
          restNum: res.data.data.havenum,
          groupNum: res.data.data.allnum,
          headImg: res.data.data.headimg,
          courseImg: res.data.data.course_img,
          evaluateImg: res.data.data.discuss_img,
          footImg: res.data.data.footimg,
          alonePrice: res.data.data.price,
          oldPrice: res.data.data.old_price,
          groupPrice: res.data.data.group_price,
          teacherHeadImg: res.data.data.teacher_headimg,
          teacherIntroImg: res.data.data.teacher_descimg,
          teacherName: res.data.data.teacher_name,
          teacherPosition: res.data.data.teacher_title
        })

        // 存进全局变量，因为在选择课程页面也要用
        app.globalData.alonePrice = res.data.data.price;
        app.globalData.oldPrice = res.data.data.old_price;
        app.globalData.groupPrice = res.data.data.group_price;
        app.globalData.teacherId = res.data.data.teacher_id;
        app.globalData.teacherName = res.data.data.teacher_name;
        app.globalData.teacherImg = res.data.data.teacher_headimg;
        app.globalData.teacherPosition = res.data.data.teacher_title;
      }
    }),

    // 获取拼团信息
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getGroup',
      success(res) {
        console.log('拼团', res)
        _this.setData({
          endTime: res.data.data.end * 1000,
          groupId: res.data.data.id,
          groupImg: res.data.data.headimgurl,
          groupName: res.data.data.nickname
        })

        // 用户头像，付款完成之后的页面要用到
        wx.setStorageSync('avatar', res.data.data.headimgurl)
      }
    }),

    // 获取轮播信息
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getSwiper',
      success(res) {
        _this.setData({
          swiperData: res.data.data
        })

        // 存进全局变量，因为在下单页面也要用
        app.globalData.swiperData = res.data.data;
      }
    })
  },

  // 转发
  onShareAppMessage(options) {
    return {
      title: "粤嵌小创客在线编程",
      imageUrl: app.globalData.baseUrl + 'Public/Small/image/share.jpg'
    }
  },

  // 滚动将“去参团”置顶
  onPageScroll: function (e) {
    if(e.scrollTop > 464){
      this.setData({
        groupClass: 'join-group-fixed'
      })
    }else{
      this.setData({
        groupClass: 'join-group'
      })
    }
  },

  // 打开活动说明/教师介绍/单独购买
  showPopup(e){
    var id = e.currentTarget.dataset.id;

    if (id == 'open1') {
      this.setData({ 
        showNotice: false
      })
    } else if (id == 'open2') {
      this.setData({
        showTeacher: false
      })
    }else{
      this.setData({
        showAlone: false
      })
    }
  },

  // 关闭活动说明/教师介绍/单独购买
  hidePopup(e) {
    var id = e.currentTarget.dataset.id;

    if (id == 'hide1') {
      this.setData({
        showNotice: true
      })
    } else if (id == 'hide2') {
      this.setData({
        showTeacher: true
      })
    } else {
      this.setData({
        showAlone: true
      })
    }
  },

  // 点击空白区域关闭弹出框
  closePopup(e) {
    var id = e.currentTarget.dataset.id;

    if(id == 'close1'){
      this.setData({
        showNotice: true
      })
    }else if(id == 'close2'){
      this.setData({
        showTeacher: true
      })
    }else{
      this.setData({
        showAlone: true
      })
    }
  },

  // 点击内容部分则不关闭弹出框
  stayPopup(){
    return
  },

  // 跳转到活动说明页面
  toPageExplain() {
    wx.navigateTo({
      url: '/pages/explain/explain'
    })
  },

  // 跳转到选择课程页面
  toPageClass(e) {
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        app.globalData.iv = res.iv;
        app.globalData.encryptedData = res.encryptedData;

        // 获取用户token
        wx.request({
          url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getmyUnionid',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            iv: app.globalData.iv,
            code: app.globalData.code,
            encryptedData: app.globalData.encryptedData
          },
          success(res) {
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('session_key', res.data.data.session_key);
          }
        })
      },
      fail(res) {
        console.log('用户拒绝授权')
      }
    })

    // 设置是否团购，订单页面要用
    var _this = this;
    var id = e.currentTarget.dataset.id;

    if(id == 'alone'){
      wx.setStorageSync('isGroup', 'no')
      wx.setStorageSync('type', 2)
      wx.setStorageSync('groupId', 0)
    } else if (id == 'group1'){
      wx.setStorageSync('isGroup', 'yes')
      wx.setStorageSync('type', 3)
      wx.setStorageSync('groupId', _this.data.groupId)
    }else{
      wx.setStorageSync('isGroup', 'yes')
      wx.setStorageSync('type', 2)
      wx.setStorageSync('groupId', 0)
    }

    wx.navigateTo({
      url: '/pages/class/class',
    })
  }
})
