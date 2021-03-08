let app = getApp()
import {
  request
} from '../index.js'
export default {
  /**
   * 获取版本信息    
   */
  version(props) {
    return request({
      url: app.data.url + "api/version/version.shtml",
      data: {
        ...props
      },
      method: 'post',
    }).then((res) => {
      return res
    })
  },
}