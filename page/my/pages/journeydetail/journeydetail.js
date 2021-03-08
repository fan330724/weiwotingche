// pages/journeydetail/journeydetail.js
var app = getApp()
import http from '../../../../request/my/journeydetail.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "", //动画
    translate: false, //动画状态
    popShow: false, //弹出框状态
    id: "", //订单id
    REASON: "", //原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      id: options.id
    })
  },
  //点击申请退款
  torefund() {
    this.setData({
      translate:true
    })
    this.animation(0)
  },
  //点击取消申请
  toclearrefund() {
    http.cancelRefundRocord(this.data.id).then(res => {
      console.log(res.data.errcode)
      if(res.data.errcode == 0){
        this.onShow()
      }
    })
  },
  //点击取消
  detail() {
    this.setData({
      translate:false
    })
    this.animation(400)
  },
  //动画
  animation(sum) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.translateY(sum + 'rpx').step()
    this.setData({
      animationData: animation.export()
    })
  },
  //点击确认
  submit() {
    var {
      ID,
      MEMBER_ID,
      IS_RECHARGE,
      TOTAL
    } = this.data.list[0]
    var {
      REASON
    } = this.data
    if (REASON) {
      http.toAddRefundRocord(ID, MEMBER_ID, IS_RECHARGE, TOTAL, REASON).then(res => {
        this.animation(400)
        this.setData({
          popShow: true
        })
        setTimeout(() => {
          this.setData({
            popShow: false
          })
          this.onShow()
        }, 1000)
      })
    } else {
      // console.log(111)
      wx.showToast({
        title: '请输入原因',
        icon: 'none'
      })
    }
  },
  //输入的内容
  totextarea(e) {
    var {
      value
    } = e.detail
    this.setData({
      REASON: value
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
    var arr = [];
    http.findOrderDetailById(this.data.id)
      .then((res) => {
        console.log(res.data)
        var data = res.data.OrderDeatil
        var title = "";
        if (data.IS_RECHARGE == 1) {
          title = '储值会员充值'
        } else if (data.IS_RECHARGE == 3) {
          title = 'PLUS会员购买'
        } else if (data.IS_RECHARGE == 4) {
          title = '卡券购买'
        }
        arr.push({
          TOTAL: parseFloat(data.TOTAL).toFixed(2),
          PAY_TYPE_NAME: data.PAY_TYPE_NAME,
          UPDATE_DATE: data.UPDATE_DATE,
          ORDER_CODE: data.ORDER_CODE,
          REFUND_STATUS: data.REFUND_STATUS,
          IS_RECHARGE: data.IS_RECHARGE,
          title,
          MEMBER_ID: data.MEMBER_ID,
          ID: data.ID,
          REFUSE_REASON: data.REFUSE_REASON,
          S_TOTAL: parseFloat(data.S_TOTAL).toFixed(2)
        })
        this.setData({
          list: arr
        })
      })
  },
})