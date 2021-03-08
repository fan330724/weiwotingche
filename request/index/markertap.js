let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 获取车场图片
   * @param {
   * PARK_ID 
   * } params     
   */
  QueryPicture(props) {
    return request({
      url: app.data.url + "mer/workPark/QueryPicture.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}