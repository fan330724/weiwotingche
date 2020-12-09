let app = getApp()
import {
  request
} from './index.js'
export default {
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
  toAddRefundRocord(id,MEMBER_ID,IS_RECHARGE,TOTAL,REASON) {
    return request({
      url: app.data.url + "api/order/toAddRefundRocord.shtml",
      data: {
        ID:id,
        MEMBER_ID:MEMBER_ID,
        IS_RECHARGE:  IS_RECHARGE,
        TOTAL: TOTAL,
        REASON:REASON
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
        ID:id,
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 查询停车位置
   * 参数 MEMBER_ID 用户手机号
   *  
   */
  parkRecordList(id) {
    return request({
      url: app.data.url + "api/park/parkRecordList.shtml",
      data: {
        MEMBER_ID:id,
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 添加停车位置
   * 参数 MEMBER_ID 用户手机号
   * LOCATION  大概位置
   * ADDRESS   详细位置
   * PIC_1：图片1
   * PIC_2：图片2
   * PIC_3：图片3 
   */
  parkRecordAdd(proms) {
    return request({
      url: app.data.url + "api/park/parkRecordAdd.shtml",
      data: {
        ...proms
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
   /**
   * 上传图片
   * 参数 HEAD_IMG  base64图片路径
   */
  parkRecordupload(HEAD_IMG) {
    return request({
      url: app.data.url + "api/park/parkRecordupload.shtml",
      data: {
        ...HEAD_IMG
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 删除位置
   * 参数 HEAD_IMG  base64图片路径
   */
  deleteparkRecord(HEAD_IMG) {
    return request({
      url: app.data.url + "api/park/deleteparkRecord.shtml",
      data: {
        ...HEAD_IMG
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
  memberInfo(cell) {
    return request({
      url: app.data.url + "api/member/memberInfo.shtml",
      data: {
        CELLPHONE:cell
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
   /**
   * 获取用户邀请
   * 参数 SHARE_CELLPHONE  手机号
   */
  getshareRecord(cell) {
    return request({
      url: app.data.url + "api/channel/getshareRecord.shtml",
      data: {
        SHARE_CELLPHONE:cell
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
   * 点击红包那个图标的时候判断是否达到可以领取红包的条件
   * 参数 CELLPHONE: 手机号,
         LON 用户经度,
         LAT用户维度,
         地图商城ID,
   */
  mallMoney(props) {
    return request({
      url: app.data.url + "api/mall/mallMoney.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 满足条件领取停车红包
   * 参数 ID 领取红包ID,
          openid  
   */
  getMallReward(props) {
    return request({
      url: app.data.url + "api/mall/getMallReward.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },

  /**
   * 领取红包的记录
   * 参数  CELLPHONE  手机号
   */
  findMoneyRecord(props) {
    return request({
      url: app.data.url + "api/mall/findMoneyRecord.shtml",
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


// use页面接口 （卡卷页面）
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


// mycar页面接口（车辆管理）
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
   * 获取绑定车辆
   * 参数 CELLPHONE 手机号,
   */
  memberPlateNumber(props) {
    return request({
      url: app.data.url + "api/member/memberPlateNumber.shtml",
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



}