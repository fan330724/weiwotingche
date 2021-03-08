var app = getApp();
import {
  login,
  showToast
} from './asyncWx.js'
import http from '../request/http.js'
export default {
  // 调用微信登录 授权手机号 并存入本地。 
  //renturn sucess 说明存在手机号 renturn err 则服务器需要获取手机
  isPhone: () => {
    // 监测本地是否存在电话号记录。
    let phone = wx.getStorageSync('CELLPHONE') || '';
    if (phone != '') {
      return 'success'
    } else {
      // 需要获取调用登录接口获取code。
      return 'err'
    }
  },

  //  利用 code 与 加密数据 换取用户手机号。
  homePhone: (e, fu) => {
    login().then((res) => {
      http.session_key({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        code: res.code
      }).then((res) => {
        console.log(res.data)
        let data = JSON.parse(res.data.data)
        wx.setStorageSync('CELLPHONE', data.phoneNumber)
        fu()
      }).catch((err) => {
        console.log(err)
        showToast({
          title: '网络错误'
        })
      })
    })
  }

}