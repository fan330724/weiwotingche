  /**
   * showToast 弹窗
   * @param {*} params
   */
  export const showToast = ({
    title
  }) => {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title: title,
        icon: 'none',
        mask: true,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
  /**
   * 
   * @param {*} params
   */
  export const login = () => {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 10000,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  }