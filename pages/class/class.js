//class.js
const app = getApp();

Page({
  data: {
    showPopup: true,
    teacherImg: '',
    teacherName: '',
    teacherPosition: '',
    currentClass: "6岁-9岁 (低年级)",
    currentTitle: "暑假班5期低年级班",
    classList:[
      "6岁-9岁 (低年级)",
      "9岁-16岁 (高年级)"
    ],
    titleList: [
      "暑假班5期低年级班",
      "暑假班5期高年级班"
    ]
  },

  onLoad: function () {
    this.openClass()

    // 获取教师信息
    this.setData({
      teacherImg: app.globalData.teacherImg,
      teacherName: app.globalData.teacherName,
      teacherPosition: app.globalData.teacherPosition
    })
  },

  // 打开弹出框
  openClass(){
    this.setData({
      showPopup: false
    })
  },

  // 选择课程之后关闭弹出框
  closeClass(e){
    var id = e.currentTarget.dataset.id;

    this.setData({
      showPopup: true,
      currentClass: this.data.classList[id],
      currentTitle: this.data.titleList[id]
    })
  },

  // 点击课程标题则不关闭弹出框
  stayPopup(){
    return
  },

  // 不选择课程关闭弹出框
  closePopup(){
    this.setData({
      showPopup: true
    })
  },

  // 跳转到订单页面
  toPageOrder() {
    var _this = this;

    // 设置班级标题，订单页面要用
    wx.setStorageSync('courseTitle', _this.data.currentTitle)

    wx.navigateTo({
      url: '/pages/order/order',
    })
  }
})
