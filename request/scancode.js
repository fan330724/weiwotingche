import {
  request
} from './index.js'
import aes from '../utils/cryptojs/aes.js'
let app = getApp();
let url = "http://192.168.1.214:9999";
// let url = "https://api.weiwopark.com";
// let url = "https://gate.weiwopark.com/api";

var password = aes.getDAes("rKu1/348LvKp0rsVC06eCA==");
export default {
  /**
   * 获取token
   * 参数：
   */
  getToken() {
    return request({
      url: url + "/auth/oauth/token?grant_type=password",
      data: {
        username: "admin",
        password: password,
        scope: "server",
      },
      header: {
        "Authorization": "Basic dGVzdDp0ZXN0",
        "Accept-Language": "zh-CN,zh;",
      },
    }).then(res => {
      return res
    })
  },
  /**
   * 获取openid
   * 参数:CODE:小程序获取的code,
   */
  getOpenid(props, token) {
    return request({
      url: url + "/paybiz/api/pay/getOpenid",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 车辆出场
   * 参数:PARK_ID：车场id,CAMERA_ID:摄像头id；OPEN_ID：用户id
   */
  getfee(props, token) {
    return request({
      url: url + "/gate/api/gateOut/scan/getfee",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
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
  advancePay(props, token) {
    return request({
      url: url + "/paybiz/api/pay/advancePay",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
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
  parkingfee(props, token) {
    return request({
      url: url + "/paybiz/api/pay/parkingFee",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取手机号
   * 参数:iv: iv,
   *      encryptedData: encryptedData,
          code: 小程序获取的code
   */
  session_key(props) {
    return request({
      url: app.data.url + "/api/xcxPay/session_key.shtml",
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
  scan(props,token) {
    return request({
      url: url + "/gate/api/gateIn/scan",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
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
  liftRod(props,token) {
    return request({
      url: url + "/gate/api/gateIn/liftRod",
      data: {
        ...props
      },
      header: {
        Authorization: "bearer" + token
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

}