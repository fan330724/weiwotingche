let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 优惠停车 优惠洗车 数据列表
   * @param {
   * CELLPHONE: 手机号,
   * pageSize
   * pageNow
   * LAT
   * LON
   * } params 
   */
  getdata(url,params) {
    return request({
      url: app.data.url + url,
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}