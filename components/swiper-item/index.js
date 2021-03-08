// components/swiper-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: {
      type: Array
    },
    idx:{
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    dh: function (e) {
      // 百度地图转腾讯地图
      console.log(e.currentTarget.dataset)
      var X_PI = 3.14159265358979324 * 3000.0 / 180.0
      var x = e.currentTarget.dataset.lon - 0.0065
      var y = e.currentTarget.dataset.lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
      var gg_lon = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      const latitude = gg_lat
      const longitude = gg_lon
      wx.openLocation({
        latitude,
        longitude,
        scale: 12,
        name: e.currentTarget.dataset.name,
        address: e.currentTarget.dataset.address
      })
    },
    markertap(e) {
      // console.log(e)
      let id = JSON.stringify(e.currentTarget.dataset.id)
      console.log(id)
      this.triggerEvent("markertap",id)
    }
  }
})