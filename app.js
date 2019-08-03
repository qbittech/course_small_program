//app.js
App({
  globalData: {
    code: '',
    appId: '',
    secret: '',
    openId: '',
    session_key: '',
    iv: '',
    encryptedData: '',
    token: '',
    swiperData: '',
    alonePrice: '',
    oldPrice: '',
    groupPrice: '',
    teacherId: '',
    teacherName: '',
    teacherImg: '',
    teacherPosition: '',
    baseUrl: 'https://www.yueqian.com.cn/zc/'
  },

  onLaunch: function () {
    wx.login({
      success: (res) => {
        // 只有code
        this.globalData.code = res.code
      }
    })
  }
})