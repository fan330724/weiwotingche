let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 订单详情
   * 参数ID 订单列表id
   */
  findOrderDetailById(id) {
    return request({
      url: app.data.url + "api/order/findOrderDetailById.shtml",
      data: {
        ID: id
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 申请退款
   * 参数 ID 订单列表id
   *      MEMBER_ID  详情id
          IS_RECHARGE  卡卷类型
          TOTAL  金额
          REASON（原因）
   */
  toAddRefundRocord(id, MEMBER_ID, IS_RECHARGE, TOTAL, REASON) {
    return request({
      url: app.data.url + "api/order/toAddRefundRocord.shtml",
      data: {
        ID: id,
        MEMBER_ID: MEMBER_ID,
        IS_RECHARGE: IS_RECHARGE,
        TOTAL: TOTAL,
        REASON: REASON
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 取消申请退款
   * 参数 ID 订单列表id
   *  
   */
  cancelRefundRocord(id) {
    return request({
      url: app.data.url + "api/order/cancelRefundRocord.shtml",
      data: {
        ID: id,
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}