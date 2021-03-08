let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 点击红包那个图标的时候判断是否达到可以领取红包的条件
   * @param {
   * CELLPHONE 手机号
   * LON 用户经度,
   * LAT用户维度,
   * 地图商城ID, 
   * } params     
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
   * 获取附近停车场
   */
  findParkInfo(props) {
    return request({
      url: app.data.url + "api/park/findParkInfo.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 获取附近中石化加油站
   */
  findSinopecList(props) {
    return request({
      url: app.data.url + "api/park/findSinopecList.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}