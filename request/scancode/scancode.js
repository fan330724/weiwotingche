import {
  request
} from '../index.js'
// let url = "http://192.168.1.214:9999";
let url = "http://192.168.1.56:9999";
// let url = "https://api.weiwopark.com";

export default {
  /**
   * 获取token
   * 参数：
   */
  getToken() {
    return new Promise((resolve, reject) => {
      request({
        url: url + "/auth/oauth/token?grant_type=password",
        data: {
          username: "admin",
          password: "rKu1/348LvKp0rsVC06eCA==",
          scope: "server",
        },
        header: {
          "Authorization": "Basic dGVzdDp0ZXN0",
          "Accept-Language": "zh-CN,zh;",
          "Content-Type": "application/x-www-form-urlencoded" //用于post
        },
        method: 'post',
      }).then(res => {
        if (res.statusCode == 200) {
          wx.setStorageSync('token', {
            time: Date.now(),
            access_token: res.data.access_token
          })
          resolve();
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'error'
          })
          reject();
        }
      })
    })

  },
  //判断token是否过期
  resetToken() {
    const token = wx.getStorageSync('token')
    if (!token) {
      return false;
    } else if (!token.access_token) {
      return false;
    } else {
      if (Date.now() - token.time > 5 * 60 * 1000) {
        return false;
      } else {
        return true;
      }
    }
  },
  /**
   * 获取openid
   * 参数:CODE:小程序获取的code,
   */
  getOpenid() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          request({
            url: url + "/paybiz/api/pay/getOpenid",
            data: {
              CODE: res.code
            },
            method: 'post',
          }).then((res) => {
            if (res.data.errcode == 0) {
              wx.setStorageSync('sconCodeOpenid', res.data.data)
              resolve()
            } else {
              wx.showToast({
                title: res.data.errmsg,
                mask: true,
                icon: "none"
              })
              reject()
            }
          })
        }
      })
    })
  },

  /**
   * 车辆出场
   * 参数:PARK_ID：车场id,CAMERA_ID:摄像头id；OPEN_ID：用户id
   */
  getfee(props) {
    return request({
      url: url + "/gate/api/gateOut/scan/getfee",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 提前付
   * 参数: PARK_ID，OPEN_ID，PLATE_NUMBER
   */
  advancePay(props) {
    return request({
      url: url + "/paybiz/api/pay/advancePay",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 停车费支付
   * 参数: PARK_ID，OPEN_ID，PLATE_NUMBER
   */
  // parkingfee(props) {
  //   return request({
  //     url: url + "/paybiz/api/pay/parkingFee",
  //     data: {
  //       ...props
  //     },
  //     method: 'post',
  //   }).then((res) => {
  //     return res
  //   })
  // },

  parkingfee(props) {
    return request({
      url: url + "/paybiz/api/SpdPay/spdPay",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  
  /**
   * 扫码入场
   * 参数:PARK_ID:车场Id，CAMERA_ID：岗亭出入口Id；OPEN_ID：用户openid
   */
  scan(props) {
    return request({
      url: url + "/gate/api/gateIn/scan",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 扫码入场抬杠
   * 参数:PARK_ID:车场Id，CAMERA_ID：岗亭出入口Id；OPEN_ID：用户openid;车牌号：PLATE_NUMBER;入场时间IN_TIME；ORDER_CODE：订单编号
   */
  liftRod(props) {
    return request({
      url: url + "/gate/api/gateIn/liftRod",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },


  /**
   * 提前付出场时间
   * 参数: 车场id
   */
  gateparkinfo(id) {
    return request({
      url: url + "/gate/gateparkinfo/" + id,
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
      // console.log("r = " + r)
      // console.log("r[2] = " + r[2])
      return r[2]
    }
    return null;
  }
}