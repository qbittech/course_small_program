// order.js
var app = getApp();

Page({
  data: {
    courseTitle: '',
    oldPrice: 0,
    finalPrice: 0,
    hasToken: true,
    showAlone: true,
    hasPhoneNumber: false,
    phoneNumber: '',
    swiperData: '',
    indicatorDots: false,
    address: ''
  },

  onLoad: function() {
    var _this = this;

    // 判断token是否存在，也就是用户是否授权获取信息
    var token = wx.getStorageSync('token');

    if(!token){
      this.setData({
        hasToken: false
      })
    }

    // 获取课程标题
    wx.getStorage({
      key: 'courseTitle',
      success(res) {
        _this.setData({
          courseTitle: res.data
        })
      }
    })

    // 获取是否团购标志
    wx.getStorage({
      key: 'isGroup',
      success(res) {
        if(res.data == 'yes'){
          _this.setData({
            showAlone: false,
            finalPrice: app.globalData.groupPrice
          })
        }else{
          _this.setData({
            showAlone: true,
            finalPrice: app.globalData.alonePrice
          })
        }
      }
    })

    // 获取课程原价和轮播信息，在首页已经存进全局变量了，直接拿出来用就行
    var price = app.globalData.oldPrice;
    var slideData = app.globalData.swiperData;

    this.setData({
      oldPrice: price,
      swiperData: slideData
    })
  },

  // 获取用户信息
  getUserInfo(e) { 
    var _this = this;

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

            _this.setData({
              hasToken: true
            })
          }
        })
      },
      fail(res) {
        console.log('用户拒绝授权')
      }
    })
  },

  // 授权获取电话号码
  getPhoneNumber(e) { 
    var _this = this;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;

    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getUserphone',
      data: {
        iv: iv,
        encryptedData: encryptedData,
        token: wx.getStorageSync('token'),
        session_key: wx.getStorageSync('session_key')
      },
      success(res) {
        if (res.data.success == 1) {
          _this.setData({
            hasPhoneNumber: true,
            phoneNumber: res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

  // 实时获取手机号码
  bindPhoneNumber(e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  // 实时获取联系地址
  bindAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },

  // 提交订单
  submitOrder(){
    var _this = this;

    // 判断手机是否为空
    if (_this.data.phoneNumber == ''){
      wx.showToast({
        title: '请输入手机',
        icon: 'error',
        duration: 2000
      })
      return
    }

    // 判断地址是否为空
    if (_this.data.address == '') {
      wx.showToast({
        title: '请输入地址',
        icon: 'error',
        duration: 2000
      })
      return
    }

    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=order',
      data: {
        token: wx.getStorageSync('token'),
        type: wx.getStorageSync('type'),
        group: wx.getStorageSync('groupId'),
        // money: _this.data.finalPrice,
        money: 0.01,
        phone: _this.data.phoneNumber,
        address: _this.data.address,
        className: _this.data.courseTitle,
        teacher_id: app.globalData.teacherId
      },
      success(res) {
        if(res.data.success == 1){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) { 
              wx.navigateTo({
                url: '/pages/payFinish/payFinish'
              })
            },
            fail(res) { 
              wx.showToast({
                title: '请重新支付',
                icon: 'error',
                duration: 2000
              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  }
})