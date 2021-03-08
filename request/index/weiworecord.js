let app = getApp()
import {
  request
} from '../index.js'
export default {
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
}