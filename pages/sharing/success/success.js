// pages/sharing/success/success.js
import http from '../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showModal:true, //弹窗控制
    showOpen: 0, //控制拆红包的状态
    ORDER_CODE: "",
    price: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ORDER_CODE: options.ORDER_CODE,
    })
    if(options.cell&&options.openid){
      http.shareRecordSave({
        SHARE_CELLPHONE: options.cell,
        B_SHARE_CELLPHONE: wx.getStorageSync('CELLPHONE'),
        openid: options.openid,
        b_openid: options.openid,
        TYPE: 0,
      }).then((res) => {
        console.log(res)
      })
    }
  },
  //跳转抽奖页面
  toLuckydraw(){
    wx.navigateTo({
      url: '../../Luckydraw/Luckydraw',
    })
  },
  //跳转附近页
  toindex() {
    wx.reLaunch({
      url: '../../index/index',
    })
  },
  //点击拆红包
  toopen() {
    this.setData({
      showOpen: 1
    })
    this.getplease()
  },
  getplease() {
    http.getPlusReward({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      openid: wx.getStorageSync('openid'),
      ORDER_CODE: this.data.ORDER_CODE
    }).then((res) => {
      console.log(res)
      if (res.data.errcode == '0') {
        this.setData({
          showOpen: 2,
          price: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
          mask:true
        })
        setTimeout(()=>{
          this.setData({
            showModal:false
          })
        },1500)
      }
    })
  },
  //关闭弹出框
  hideMask() {
    this.setData({
      showModal: false
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
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (res) {
  //   if (res.from == 'button') {
  //     let CELLPHONE = wx.getStorageSync('CELLPHONE')
  //     return {
  //       title: '过节大礼包，我只送给你！快快领取吧！',
  //       // desc: '帷幄停车',
  //       path: '/pages/openhongbao/index?cellphone=' + CELLPHONE + '&chnnel=' + wx.getStorageSync('openid') + '&type=0',
  //       imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
  //       success: () => {
  //         wx.showShareMenu({
  //           withShareTicket: true,
  //         })
  //       }
  //     }
  //   } else if (res.from == 'menu') {
  //     let CELLPHONE = wx.getStorageSync('CELLPHONE')
  //     return {
  //       title: '过节大礼包，我只送给你！快快领取吧！',
  //       // desc: '帷幄停车',
  //       path: '/pages/openhongbao/index?cellphone=' + CELLPHONE + '&chnnel=' + wx.getStorageSync('openid') + '&type=0',
  //       imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
  //       success: () => {
  //         wx.showShareMenu({
  //           withShareTicket: true,
  //         })
  //       }
  //     }
  //   }
  // },
})