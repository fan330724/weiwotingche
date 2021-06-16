let app = getApp()
import {
  request
} from './index.js'
export default {
  /**
   * 获取用户邀请
   * 参数 SHARE_CELLPHONE  手机号
   */
  getshareRecord(cell) {
    return request({
      url: app.data.url + "api/channel/getshareRecord.shtml",
      data: {
        SHARE_CELLPHONE: cell
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 发红包接口
   * 参数 SHARE_CELLPHONE: 邀请人手机号,
        B_SHARE_CELLPHONE: 被邀请人手机号,
        openid: 邀请人openid,
        b_openid: 被邀请人openid,
        TYPE: 进来渠道,
   */
  shareRecordSave(props) {
    return request({
      url: app.data.url + "api/channel/shareRecordSave.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 成为PLUS会员发红包接口
   * 参数 CELLPHONE: 手机号,
         openid: openid,
        ORDER_CODE: 订单编号,
   */
  getPlusReward(props) {
    return request({
      url: app.data.url + "api/channel/getPlusReward.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 邀请接口
   * 参数  CELLPHONE  被邀请人
   *       INVITER：邀请人
   *       openid 
   */
  memberBound(props) {
    return request({
      url: app.data.url + "api/member/memberBound.shtml ",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取中月卡的概率
   * 参数  空
   */
  getProbabiByOrder(props) {
    return request({
      url: app.data.url + "api/channel/getProbabiByOrder.shtml ",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 保存中奖纪录
   * 参数  CELLPHONE手机号、 
   *       LOTTERY：奖品（PLUS年卡和红包）
   *       LOTTERY_TYPE：红包类型 （1是年卡，2是红包，其他的不保存）
   */
  toSaveLotteryRecord(props) {
    return request({
      url: app.data.url + "api/channel/toSaveLotteryRecord.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取中奖纪录
   * 参数 CELLPHONE手机号
   */
  getLotteryRecordList(props) {
    return request({
      url: app.data.url + "api/channel/getLotteryRecordList.shtml ",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },








  /**
   * 打卡签到
   * 参数 CELLPHONE 手机号,
   */
  toSignRecord(props) {
    return request({
      url: app.data.url + "api/channel/toSignRecord.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取是否可签到
   * 参数 CELLPHONE 手机号,
   */
  getSignCount(props) {
    return request({
      url: app.data.url + "api/channel/getSignCount.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },










  /**
   * 获取手机号
   * iv
     encryptedData
     code
   */
  session_key(params) {
    return request({
      url: app.data.url + "api/xcxPay/session_key.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 登录
   */
  loginApp(params) {
    return request({
      url: app.data.url + "api/member/loginApp.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 登录
   */
  login(params) {
    return request({
      url: app.data.url + "api/member/login.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取个人信息
   * 参数 CELLPHONE  手机号
   */
  memberInfo(params) {
    return request({
      url: app.data.url + "api/member/memberInfo.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取车辆信息
   * @param {
   * CELLPHONE 手机号
   * } params 
   */
  memberPlateNumber(params) {
    return request({
      url: app.data.url + "api/member/memberPlateNumber.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取钱包
   * @param {
   * CELLPHONE 手机号
   * } params 
   */
  wallect(params) {
    return request({
      url: app.data.url + "api/wallect/wallect.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取卡卷
   * 参数 CELLPHONE: 手机号,
        pageNow,
        pageSize,
        status: 状态
    */
  mycards(params) {
    return request({
      url: app.data.url + "api/cardCase/mycards.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
  * 删除车辆
  * 参数 CELLPHONE 手机号,
         PLATENUMBER  车牌号,
  */
  unBindingPlateNumber(props) {
    return request({
      url: app.data.url + "api/member/unBindingPlateNumber.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 绑定车辆
   * 参数 CELLPHONE 手机号,
   *      PLATENUMBER: 输入的车牌号
   */
  bindingPlateNumber(props) {
    return request({
      url: app.data.url + "api/member/bindingPlateNumber.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 充值PLUS会员接口
   */
  vip(props) {
    return request({
      url: app.data.url + "api/pay/vip.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 充值储值会员接口
   */
  recharge(props) {
    return request({
      url: app.data.url + "api/pay/recharge.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 获取订单    
   */
  findOrderRefillBuyHis(props) {
    return request({
      url: app.data.url + "api/order/findOrderRefillBuyHis.shtml",
      data: {
        ...props
      },
      dataType: "json",
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取停车记录信息
   * @param {
   * CELLPHONE 手机号
   * pageNow 
   * pageSize
   * IS_RECHARGE 
   * } params 
   */
  findOrderHis(params) {
    return request({
      url: app.data.url + "api/order/findOrderHis.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  vehicleState(params) {
    return request({
      url: app.data.url + "api/order/vehicleState.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取通知    
   */
  owner(props) {
    return request({
      url: app.data.url + "api/notice/owner.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

}