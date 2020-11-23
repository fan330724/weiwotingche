var app = getApp();

export default {
  // 调用微信登录 授权手机号 并存入本地。 
  //renturn sucess 说明存在手机号 renturn err 则服务器需要获取手机
  isPhone:()=>{
    // 监测本地是否存在电话号记录。
    let phone = wx.getStorageSync('CELLPHONE') || '';
    if (phone!=''){
      return 'success'
    }else{
      // 需要获取调用登录接口获取code。
        return 'err'
    }
  },

  //  利用 code 与 加密数据 换取用户手机号。
  homePhone:(e,fu)=>{
    wx.login({
      success: res => {
        wx.request({
          url: app.data.url + '/api/xcxPay/session_key.shtml',
          data: {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            code: res.code
          },
          method: "POST",
          success: function (ress) {
              let datas = JSON.parse(ress.data.data)
              console.log(datas)
              wx.setStorageSync('CELLPHONE', datas.phoneNumber)
              fu()
          }
        })
      }
    })
  }
  
}