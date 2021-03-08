let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 上传图片
   * @param {
   * HEAD_IMG base64图片路径
   * } params 
   */
  parkRecordupload(params) {
    return request({
      url: app.data.url + "api/park/parkRecordupload.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
  /**
   * 添加停车位置
   * @param {
   * MEMBER_ID 用户手机号
   * LOCATION  大概位置
   * ADDRESS   详细位置
   * PIC_1：图片1
   * PIC_2：图片2
   * PIC_3：图片3
   * } params 
   */
  parkRecordAdd(params) {
    return request({
      url: app.data.url + "api/park/parkRecordAdd.shtml",
      data: {
        ...params
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}