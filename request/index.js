/** 使用示例
 * request({
 *  data:{
 * 
 *  },
 *  method:'',
 *  header:{
 * 
 *  }
 * }).then((res) => {
 *    console.log(res)
 * }).catch((err) => {
 *    console.log(err)
 * })
 */



//同时发送异步代码的次数
var ajaxTime = 0
export const request = (proms)=>{
  ajaxTime++
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return new Promise((resolve,reject)=>{
    wx.request({
      ...proms,
      success:(res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      },
      complete:()=>{
        ajaxTime--
        if(ajaxTime === 0){
          wx.hideLoading()
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        }
      }
    })
  })
}     