// pages/positiondetail/positiondetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics:[], //图片
    list:"", //列表详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.item)
    let pics = this.data.pics;
    if(JSON.parse(options.item).PIC_1){
      pics.push('http://124.70.23.12:8084/'+JSON.parse(options.item).PIC_1)
    }
    if(JSON.parse(options.item).PIC_2){
      pics.push('http://124.70.23.12:8084/'+JSON.parse(options.item).PIC_2)
    }
    if(JSON.parse(options.item).PIC_3){
      pics.push('http://124.70.23.12:8084/'+JSON.parse(options.item).PIC_3)
    }
    this.setData({
      list:JSON.parse(options.item),
      pics
    })
  },
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
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  imageOnloadError(e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var pics = this.data.pics
    pics[index] = 'http://124.70.23.12:8084/gameIcon/image/t-err.png';
    this.setData({
      pics
    })
  },
})