// payFinish.js
var app = getApp();

Page({
  data: {
    endTime: '',
    timer: '',
    hour: '',
    minute: '',
    second: '',
    number: 1,
    avatarOne: '',
    avatarTwo: '',
    avatarThree: '',
    showAvatarTwo: false,
    showAvatarThree: false,
    showCountdown: true
  },

  onLoad: function() {
    var _this = this;

    // 获取信息
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=getGroupInfo',
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.success == 1) {
          // 设置用户头像
          if(res.data.data.num == 2){
            _this.setData({
              avatarOne: res.data.data.arr[0]
            })
          } else if (res.data.data.num == 1) {
            _this.setData({
              avatarOne: res.data.data.arr[0],
              avatarTwo: res.data.data.arr[1],
              showAvatarTwo: true
            })
          } else {
            _this.setData({
              avatarOne: res.data.data.arr[0],
              avatarTwo: res.data.data.arr[1],
              avatarThree: res.data.data.arr[2],
              showAvatarTwo: true,
              showAvatarThree: true,
              showCountdown: false
            })
          }

          // 初始化倒计时
          _this.setData({
            number: res.data.data.num,
            endTime: res.data.data.time*1000
          })
        }
      }
    })

    // 设置倒计时
    this.data.timer = setInterval(() => {
      this.getCountdown();

      if (this.data.hour == '00' && this.data.minute == '00' && this.data.second == '00') {
        clearInterval(this.data.timer);
      }
    }, 1000)
  },

  // 计算倒计时
  getCountdown(){
    var currentTime = Date.parse(new Date());
    let rest = this.data.endTime - currentTime;

    // 将时间差（毫秒）格式为：时分秒
    let hours = parseInt((rest % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((rest % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((rest % (1000 * 60)) / 1000);

    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }

    this.setData({
      hour: hours,
      minute: minutes,
      second: seconds
    })
  },

  // 跳转到海报页面
  toPagePoster() {
    wx.navigateTo({
      url: '/pages/poster/poster'
    })
  },

  // 转发
  onShareAppMessage: function() {
    return {
      title: "粤嵌小创客在线编程",
      imageUrl: app.globalData.baseUrl + 'Public/Small/image/share.jpg'
    }
  },

  // 跳转到活动说明页面
  toPageExplain() {
    wx.navigateTo({
      url: '/pages/explain/explain'
    })
  }
})