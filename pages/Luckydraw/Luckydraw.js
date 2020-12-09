//计数器
var interval = null;
//值越大旋转时间越长  即旋转速度
var intime = 50;
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    //8张奖品图片
    images: [
      'http://124.70.23.12:8084/gameIcon/jiugongge/4.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/1.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/2.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/3.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/4.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/5.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/6.png',
      'http://124.70.23.12:8084/gameIcon/jiugongge/7.png'
    ],
    btnconfirm: 'http://124.70.23.12:8084/gameIcon/jiugongge/start.png',
    clickLuck: 'clickLuck', //控制按钮是否可以点击
    luckPosition: '', //停在哪个奖励上
    inx: 1, //轮播图显示的数量
    showModal: false, //弹窗控制
    price: "", //红包金额
    num: 0, //抽奖次数
    lot: "", //当前登录人中奖纪录
    lotj: "", //他人中奖的信息
    LOTTERY:'', //奖品
    LOTTERY_TYPE:"", //奖品类型
    index:"", //取抽奖索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAnimation(1000);
  },

  //点击抽奖按钮
  clickLuck() {
    var that = this;
    that.setData({
      clickLuck: '',
    })
    if (that.data.num <= 0) {
      wx.showToast({
        title: '无抽奖机会，快去开通PLUS会员得抽奖机会吧',
        icon: 'none'
      })
      that.setData({
        clickLuck: 'clickLuck',
      })
    } else {
      //清空计时器
      clearInterval(interval);
      //循环设置每一项的透明度
      that.loadAnimation(intime)

      //模拟网络请求时间  设为两秒
      var stoptime = 1000;
      setTimeout(function () {
        that.stop(that.data.luckPosition);
        // that.stopLuck(that.data.luckPosition, that.data.index, intime, 10);
      }, stoptime)
    }
  },
  stop: function (which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;
    e.stopLuck(which, index, intime, 10);
  },
  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck: function (which, index, time, splittime) {
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var color = e.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        color[7] = 0.5
      } else if (index != 0) {
        color[index - 1] = 0.5
      }
      //当前位置为选中状态
      color[index] = 1
      e.setData({
        color: color,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          if (which == 6 || which == 1) {
            e.toSaveLotteryRecord()
          }
          // else {
          //   //未中奖
          //   wx.showModal({
          //     title: '提示',
          //     content: '很遗憾未中奖',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         //设置按钮可以点击
          //         e.setData({
          //           clickLuck: 'clickLuck',
          //         })
          //         e.loadAnimation(1000);
          //       }
          //     }
          //   })
          // }
        }, 1000);
      }
    }, time);
  },
  //进入页面时缓慢切换
  loadAnimation: function (intime) {
    var e = this;
    e.setData({
      color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    })
    var index = 0;
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        e.data.color[7] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      index++;
      // console.log(index);
      e.setData({
        color: e.data.color,
        index
      })
    }, intime);
  },
  hideMask() {
    this.setData({
      showModal: false,
      clickLuck: 'clickLuck',
    })
    this.loadAnimation(1000);
    this.onShow()
  },
  //跳转会员中心
  tomember() {
    wx.navigateTo({
      url: '../member/member',
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
    if(wx.getStorageSync('CELLPHONE')){
      this.memberInfo()
      this.getLotteryRecordList()
      this.getProbabiByOrder()
    }else{
      wx.redirectTo({
        url: '../login/login?type=Luckydraw',
      })
    }
    
  },
  //获取次数
  memberInfo() {
    http.memberInfo(wx.getStorageSync('CELLPHONE')).then((res) => {
      this.setData({
        num: res.data.data.data.LUCK_FREQ || 0
      })
    })
  },
  //获取中奖信息
  getLotteryRecordList() {
    http.getLotteryRecordList({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then((res) => {
      var list = res.data.data;
      var arr = []
      var lot = []
      var LOTTERY = ''
      list.lotJ.filter((res) => {
        var cell = res.CELLPHONE.toString().substring(0, 3) + '**'
        arr.push({
          CELLPHONE: cell,
          LOTTERY:res.LOTTERY
        })
      })
      list.lot.filter((res) => {
        var date = res.CREATE_DATE.toString().substring(0,10)
        console.log(isNaN(res.LOTTERY))
        if(isNaN(res.LOTTERY)){
          LOTTERY = res.LOTTERY
        }else{
          LOTTERY = res.LOTTERY + '元'
        }
        lot.push({
          date: date,
          LOTTERY: res.LOTTERY,
          LOTTERY: LOTTERY
        })
      })
      this.setData({
        lot: lot,
        lotj: arr,
      })

      if(this.data.lot.length <4){
        this.setData({
          inx: this.data.lot.length
        })
      }else{
        this.setData({
          inx: 4
        })
      }
    })
  },
  //获取抽中年卡的概率
  getProbabiByOrder(){
    http.getProbabiByOrder().then((res) => {
      var data = res.data.data
      console.log(data)
      if(data >= 1){
        this.setData({
          luckPosition:1
        })
      }else{
        this.setData({
          luckPosition:6,
          showModal:false,
          clickLuck:'clickLuck'
        })
        // this.loadAnimation(1000);
      }
    })
  },
  //保存中奖记录
  toSaveLotteryRecord(){
    switch(this.data.luckPosition){
      case 1: this.setData({
        LOTTERY: 'PLUS年卡',
        LOTTERY_TYPE: 1
      })
        break;
      case 6: this.setData({
        LOTTERY: '红包',
        LOTTERY_TYPE: 2
      })
        break;
    }
    http.toSaveLotteryRecord({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      LOTTERY: this.data.LOTTERY,
      LOTTERY_TYPE: this.data.LOTTERY_TYPE,
      OPENID: wx.getStorageSync('openid')
    }).then((res) => {
      console.log(res.data)
      //中奖
      this.setData({
        showModal: true,
        price: res.data.data
      })
    })
  },
  //跳转活动规则
  torule() {
    wx.navigateTo({
      url: '../sharing/rule/rule?type=2',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})