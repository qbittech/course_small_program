//poster.js
var app = getApp();

Page({
  data: {
    poster: '',
    showPopup: true,
    copyText: '孩子在网上学的编程课，喜欢的不行，不仅在创作中学会了用编程的方式解决问题，还提高了学习的自主性😊感兴趣的快来一起学，和我家娃一起讨论作品，扫下图二维码就能报名✋'
  },

  onLoad: function() {
    var _this = this;

    // 获取海报
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.baseUrl + 'index.php?m=Api&c=Index&a=makeBill',
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        _this.setData({
          poster: res.data.data
        })
      }
    })
  },

  // 保存海报
  savePoster: function (e) {
    //保存图片
    var _this = this;
    
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function (res) {
        wx.downloadFile({
          url: _this.data.poster,
          success: function (res) {
            // 下载成功后再保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                })
              }
            })
          }
        })
      }
    })
  },
  
  // 打开弹出框
  openPopup() {
    this.setData({
      showPopup: false
    })
  },

  // 点击内容则不关闭弹出框
  stayPopup() {
    return
  },

  // 点击空白背景关闭弹出框
  closePopup() {
    this.setData({
      showPopup: true
    })
  },

  // 复制文字
  copyText() {
    var _this = this;
    
    wx.setClipboardData({
      data: _this.data.copyText,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }
})
