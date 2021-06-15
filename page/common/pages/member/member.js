// pages/member/member.js
var app = getApp()
import http from '../../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabbar切换下标
    active: 1,
    // 按钮文字
    btn: "已售罄",
    //余额
    total: 0.00,
    //有效期
    enddate: "",
    //会员昵称
    nickName: "",
    //动态高
    height: "",
    mainH: "",
    cell: "",
    openid: "",
    rank:"",
  },
  select(e) {
    var dataid = e.currentTarget.dataset.id
    this.setData({
      active: dataid
    })
  },
  torecharge(e) {
    console.log(e)
    var {
      text
    } = e.currentTarget.dataset
    switch (text) {
      case "立即续费":
        wx.navigateTo({
          url: '../plusrecharge/plusrecharge?cell=' + this.data.cell + '&openid=' + this.data.openid,
        });
        break;
      case "立即领取":
        return;
        break;
      case "立即开通":
        wx.navigateTo({
          url: '../plusrecharge/plusrecharge?cell=' + this.data.cell + '&openid=' + this.data.openid,
        });
        break;
    }
  },
  //储值跳转充值
  onrecharge() {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  //跳转充值记录
  torecord() {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  toquanyi(e) {
    var {
      title
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../quanyi/quanyi?title=' + title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethui()
    this.getheight()
    if (app.globalData.userInfo) {
      var nickName = app.globalData.userInfo.nickName
      this.setData({
        nickName
      })
    } else {
      this.getName()
    }
  },
  gethui() {
    var that = this
    http.memberInfo({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then((res) => {
      var rank = res.data.data.data.VIP_RANK
      that.setData({
        rank
      })
      if (rank == 0) {
        // that.setData({
        //   btn: "立即开通"
        // })
        return
      } else if (rank == 1) {
        var enddate = res.data.data.data.RANK_DATE.substring(0, 10)
        that.setData({
          // btn: "立即续费",
          enddate
        })
      }
    })
  },
  getName() {
    http.memberInfo({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then((res) => {
      var nickName = res.data.data.data.NICKNAME
      this.setData({
        nickName
      })
    })
  },
  getheight() {
    var that = this
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.tab').boundingClientRect()
    query.select('.bg').boundingClientRect()
    query.select('.color').boundingClientRect()
    query.select('.btn').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为myText的元素的信息 的数组
      // console.log(res);
      var sum = 0;
      var h = res.reduce((v, i) => {
        // console.log(i.height)
        return (sum += i.height)
      }, 0)
      console.log(h)
      // var mh = res[4].height
      wx.getSystemInfo({
        success(res) {
          var height = (res.windowHeight - (h + 55)) + "px"
          console.log(res.windowHeight)
          console.log(height)
          var mainH = parseInt(height) + 'px'
          console.log(mainH)
          that.setData({
            height,
            mainH
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        http.wallect({
          CELLPHONE: res.data + '',
        }).then((res) => {
          that.setData({
            total: parseFloat(res.data.data.datas.TOTAL_FEE).toFixed(2)
          })
        })
      }
    })
  },
})