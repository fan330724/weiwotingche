// pages/member/member.js
var app = getApp()
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabbar切换下标
    active: 1,
    // 特权列表
    // list: [{
    //     image: "../../image/member/jiayou.png",
    //     text: "优惠加油"
    //   },
    //   {
    //     image: "../../image/member/xiche.png",
    //     text: "五折洗车"
    //   },
    //   {
    //     image: "../../image/member/tingche.png",
    //     text: "优惠停车"
    //   },
    //   {
    //     image: "../../image/member/fuli.png",
    //     text: "专享福利"
    //   }
    // ],
    // 按钮文字
    btn: "立即开通",
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
    console.log(options)
    if (options.cell != 'undefined' || options.cell != '' && options.openid != 'undefined' || options.openid != '') {
      http.memberBound({
        INVITER: options.cell,
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        OPENID: options.openid
      }).then((res) => {
        console.log(res)
        if (res.data.errcode == 0) {
          this.setData({
            cell: options.cell,
            openid: options.openid
          })
        }
      })
    }
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
    wx.request({
      url: app.data.url + '/api/member/memberInfo.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE')
      },
      success: (res) => {
        console.log(res)
        var rank = res.data.data.data.VIP_RANK
        if (rank == 0) {
          that.setData({
            btn: "立即开通"
          })
        } else if (rank == 1) {
          var enddate = res.data.data.data.RANK_DATE.substring(0, 10)
          that.setData({
            btn: "立即续费",
            enddate
          })
        }
      }
    })
  },
  getName() {
    wx.request({
      url: app.data.url + '/api/member/memberInfo.shtml',
      data: {
        CELLPHONE: wx.getStorageSync("CELLPHONE")
      },
      method: "post",
      success: (res) => {
        console.log(res.data.data.data.NICKNAME)
        var nickName = res.data.data.data.NICKNAME
        this.setData({
          nickName
        })
      }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
        // console.log("data:" + res.data);
        wx.request({
          url: app.data.url + '/api/wallect/wallect.shtml',
          data: {
            CELLPHONE: res.data + '',
          },
          method: 'POST',
          success: function (position) {
            // console.log(position)
            //字符串转对象
            wx.hideLoading();
            that.setData({
              total: parseFloat(position.data.data.datas.TOTAL_FEE).toFixed(2)
            })
          },
          dataType: "json"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})