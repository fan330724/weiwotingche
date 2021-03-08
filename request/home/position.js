let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 查询停车位置
   * @param {
   * MEMBER_ID 用户手机号
   * } params 
   */
  parkRecordList(params) {
    return request({
      url: app.data.url + 'api/park/parkRecordList.shtml',
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 删除位置
   * @param {
   * ID 
   * } params 
   */
  deleteparkRecord(params) {
    return request({
      url: app.data.url + 'api/park/deleteparkRecord.shtml',
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}