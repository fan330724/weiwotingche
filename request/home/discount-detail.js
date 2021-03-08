let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 优惠停车 优惠洗车 详情页数据
   * @param {
   * BIZ_ID 列表ID
   * } params 
   */
  sgList(params) {
    return request({
      url: app.data.url + 'api/biz/sgList.shtml',
      data: {
        ...params
      },
      header: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 调起充值接口
   * @param {
   * CELLPHONE  手机号,
   * PAY_TYPE  'wxxpay',
   * TOTAL  价格,
   * SG_ID  id,
   * IS_SVIP_PRICE 是否为会员价,
   * openid
   * } params 
   */
  sg(params) {
    return request({
      url: app.data.url + 'api/pay/sg.shtml',
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}