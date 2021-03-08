// pages/results/results.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cook:0,
    text:"恭喜您成为帷幄PLUS会员",
    btntext:"立即体验"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.cook==0){
      this.setData({
        text:"购买成功",
        cook:0
      })
    }else if(options.cook==1){
      this.setData({
        text:"抱歉，支付失败，请重新支付！",
        btntext:"重新支付",
        cook:1
      })
    }else if(options.cook == 2){
      this.setData({
        text:"充值成功",
        btntext:"查看充值记录",
        cook:2
      })
    }
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
})