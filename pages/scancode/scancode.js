import http from "../../request/scancode.js"
const token = wx.getStorageSync('token')
let app = getApp()
export default {

  //判断token是否过期
  resetToken() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.getToken()
    } else if (!token.access_token) {
      this.getToken()
    } else {
      if (Date.now() - token.time > 10 * 60 * 1000) {
        this.getToken()
      } else {
        app.data.token = token.access_token
      }
    }
  },
  //获取token
  getToken() {
    http.getToken().then(res => {
      // console.log(res)
      if (res.statusCode == 200) {
        wx.setStorageSync('token', {
          time: Date.now(),
          access_token: res.data.access_token
        })
        app.data.token = token.access_token
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getQueryString: function (url, name) {
    console.log("url = " + url)
    console.log("name = " + name)
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
      console.log("r = " + r)
      console.log("r[2] = " + r[2])
      return r[2]
    }
    return null;
  }
}