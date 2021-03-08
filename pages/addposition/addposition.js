const qqmap = require('../../utils/qqmap.js');
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [], //图片
    picss:[],
    text: "请选择地理位置", //默认值
    latitude: "",
    longitude: "", //经纬度
    LOCATION: "", //位置
    ADDRESS: "", //车位信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation()
  },
  //获取地理位置
  getUserLocation() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.getLocation();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.getLocation();
        }
      }
    })
  },
  //获取解析地址
  getLocation() {
    var that = this;
    //逆解析地址
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //地址逆解析获取cityname
        qqmap.nimap(that.data.latitude, that.data.longitude, function (res) {
          console.log(res)
          that.setData({
            LOCATION: res.result.address
          })
        })
      }
    })
  },
  //点击重新选择定位
  togetUserLocation() {
    var that = this
    wx.chooseLocation({
      success(res) {
        console.log(res)
        that.setData({
          LOCATION: res.name
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 图片上传
   * 
   */
  //选择图片
  chooseImage() {
    var that = this,
      pics = this.data.pics,
      picss = this.data.picss;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        http.parkRecordupload({
          HEAD_IMG: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        }).then(res => {
          console.log(res.data.data.imgUrl)
          pics.push(res.data.data.imgUrl)
          that.setData({
            pics:pics,
          })
        })
      },
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    console.log(pics)
    this.setData({
      pics: pics,
    })
  },
  //提交
  toSubmit(e) {
    console.log(e)
    if (e.detail.value.textarea == "") {
      wx.showToast({
        title: '请输入详细信息',
        icon: "none",
      })
    } else if(this.data.pics.length == 0){
      wx.showToast({
        title: '请上传图片',
        icon: "none",
      })
    } else {
      http.parkRecordAdd({
        MEMBER_ID: wx.getStorageSync('CELLPHONE'),
        LOCATION: this.data.LOCATION,
        ADDRESS: e.detail.value.textarea,
        PIC_1: this.data.pics[0] || "",
        PIC_2: this.data.pics[1] || "",
        PIC_3: this.data.pics[2] || "",
      }).then((res) => {
        console.log(res)
        if(res.data.errcode == 0){
          wx.showToast({
            title: '添加成功'
          })
          setTimeout(()=>{
            wx.navigateBack()
          },1500)
        }
      })
    }
  }
})