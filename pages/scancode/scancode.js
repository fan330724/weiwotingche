import http from "../../request/scancode.js"
const token = wx.getStorageSync('token')
let app = getApp()
export default {

  //判断token是否过期
  resetToken() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.getToken()
    } else {
      if (Date.now() - token.time > 3 * 60 * 1000) {
        this.getToken()
      } else {
        app.data.token = token.access_token
      }
    }
  },
  //获取token
  getToken() {
    http.getToken().then(res => {
      // console.log(res.data.access_token)
      wx.setStorageSync('token', {
        time: Date.now(),
        access_token: res.data.access_token
      })
      app.data.token = token.access_token
    })
  },
}