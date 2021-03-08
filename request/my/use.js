let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 获取优惠券二维码
   * 参数 id 优惠券id
   */
  qrcode(props) {
    return request({
      url: app.data.url + "api/carwash/qrcode.shtml",
      data: {
        ...props
      },
      responseType: "arraybuffer",
      method: 'get',
    }).then((res) => {
      return res
    })
  },
  /**
  * 使用停车优惠券
  * 参数 PARK_ID,
         CARD_ID,
         PLATE_NUMBER,
  */
  wwCoupon(props) {
    return request({
      url: app.data.url + "api/parkCoupon/wwCoupon.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取自营车场列表
   */
  wwParkList(props) {
    return request({
      url: app.data.url + "api/parkCoupon/wwParkList.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取优惠券兑换码
   * 参数 CARD_ID 优惠券 id
   */
  tlwCoupon(props) {
    return request({
      url: app.data.url + "api/parkCoupon/tlwCoupon.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}