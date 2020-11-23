 // 获取全局参数

 var app = getApp();
 import phone from '../../utils/phone.js'
 
 
 var app = getApp()
 var checkNetWork = require("../../utils/CheckNetWork.js")
 Page({
   /**
    * 页面的初始数据
    */
   data: {
     havePhone: 0, // 0 表示没有手机号  1 表示有手机号
     in_url: 'https://bc.weiwopark.com/appCoupon/info',
     b_url: 'https://bc.weiwopark.com/appCoupon/get',
     isKeyboard: false,//是否显示键盘
     specialBtn: false,
     tapNum: false,//数字键盘是否可以点击
     isFocus: false,//输入框聚焦
     flag: false,//防止多次点击的阀门
     keyboardNumber: '1234567890',
     keyboardAlph: 'QWERTYUIOPASDFGHJKLZXCVBNM警领学巛港澳',
     keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝使',
     keyboard2: '',
     keyboard2For: ['绑定'],
     keyboardValue: '',
     textArr: [],
     textValue: '',
     placeholder: '请输入车牌',
     newcar: 7,
     // 控制显示
     tab: 0,
     array: [],
     index: '0',
     // 停车券信息
     couponpassword: '',
     couponval: '',
     couponaddress: '',
     couponsh: '',
     active: '',    //优惠券状态 
     Hpwd: '',      // 后台优惠券密码
     pwd: '',       //优惠券密码
     showModal: false,//模态框的显示  
     ifcar: false
   },
 
   /**
    * 生命周期函数--监听页面加载
    */
   // 直接获取页面参数存入app会话
   onLoad: function (options) {
     // 获取URL中的参数
     if (options.id==1){
       
     }
     else{
       var scan_url = decodeURIComponent(options.q);
       var surls = scan_url.split('/appCertificate/coupon/')
       var vid = surls[1]
       app.data.coupon = vid;
       console.log(vid)
     }
   },
   // 判断是否有手机存在本地。
   isPhone: function () {
     //success 标识存在手机号 err不存在手机号 code 已经更新存到本地。
     let val = phone.isPhone()
     let _this = this
     if (val == 'success') {
       
       _this.setData({
         havePhone: 1
       })
       _this.getCanvard()
     } else {
       _this.setData({
         havePhone: 0
       })
     }
 
   },
   onReady: function () {
     //车牌事件
     var self = this;
     //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
     self.data.keyboard1 = self.data.keyboard1.split('')
     self.data.keyboard2 = self.data.keyboard2.split('')
     self.setData({
       keyboardValue: self.data.keyboard1
     })
    
   },
   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
       var self = this;
       self.isPhone()
       self.setData({
         flag: false
       });
       wx.showLoading({
         title: '加载中',
         mask: false
       })
       // 获取优惠券信息
       wx.request({
         url: self.data.in_url,
         data: {
           COUPON_ID: app.data.coupon + "",
         },
         header: {
           'content-type': 'application/x-www-form-urlencoded' // 默认值
         },
         method: 'POST',
         success: function (res) {
           console.log(res)
           wx.hideLoading()
           self.setData({
             couponval: res.data.COUPON_INFO,
             couponaddress: res.data.PARK_NAME,
             couponsh: res.data.BC_NAME,
             active: res.data.USAGE_MODE
           })
           if (res.data.USAGE_MODE == 1) {
             self.setData({
               showModal: true,
               Hpwd: res.data.TEST
             })
           }
         }
       })
   },
   // 授权获取加密数据并解密。
   getPhoneNumber(e) {
     let _this = this
     let self =this
     if (!e.detail.iv) {
       wx.showToast({
         title: '必须登录后使用',
         icon: 'loading'
       })
       return;
     }
     wx.showLoading({
       title: '正在登录',
       mask: true
     })
     phone.homePhone(e, function () {
       console.log('绑定成功')
       wx.hideLoading()
       wx.showToast({
         title: '登陆成功',
       })
       _this.setData({
         havePhone: 1
       })
       // 获取车辆信息
       _this.getCanvard()
     })
 
   },
   // 车辆切换
   radioChange: function (e) {
     var that = this
     that.setData({
       tab: e.detail.value,
       textValue: '',
       textArr: [],
       isKeyboard: false,
       isFocus: true,
       keyboardValue: that.data.keyboard1,
       specialBtn: false
     })
   },
   /**
    * 输入框显示键盘状态
    */
   showKeyboard: function () {
     var self = this;
     self.setData({
       isFocus: true,
       isKeyboard: true,
     })
   },
   /**
    * 点击页面隐藏键盘事件
    */
   hideKeyboard: function () {
     var self = this;
     if (self.data.isKeyboard) {
       //说明键盘是显示的，再次点击要隐藏键盘
       if (self.data.textValue) {
         self.setData({
           isKeyboard: false
         })
       } else {
         self.setData({
           isKeyboard: false,
           isFocus: false
         })
       }
 
     }
   },
   /**
    * 输入框聚焦触发，显示键盘
    */
   bindFocus: function () {
     var self = this;
     if (self.data.isKeyboard) {
       //说明键盘是显示的，再次点击要隐藏键盘
       self.setData({
         isKeyboard: false,
         isFocus: true,
       })
     } else {
       //说明键盘是隐藏的，再次点击显示键盘
       self.setData({
         isFocus: true,
         isKeyboard: true,
       })
     }
   },
   /**
    * 键盘事件
    */
   tapKeyboard: function (e) {
     var self = this;
 
     //获取键盘点击的内容，并将内容赋值到textarea框中
     var tapIndex = e.target.dataset.index;
     var tapVal = e.target.dataset.val;
     var keyboardValue;
     var specialBtn;
     var tapNum;
     if (tapVal == "巛") {
       //说明是删除
       self.data.textArr.pop();
       if (self.data.textArr.length == 0) {
         //说明没有数据了，返回到省份选择键盘
         this.specialBtn = false;
         this.tapNum = false;
         this.keyboardValue = self.data.keyboard1;
       } else if (self.data.textArr.length == 1) {
         //只能输入字母
         this.tapNum = false;
         this.specialBtn = true;
         this.keyboardValue = self.data.keyboard2;
       } else {
         this.specialBtn = true;
         this.tapNum = true;
         this.keyboardValue = self.data.keyboard2;
       }
       self.data.textValue = self.data.textArr.join("");
       self.setData({
         textValue: self.data.textValue,
         keyboardValue: this.keyboardValue,
         specialBtn: this.specialBtn,
         tapNum: this.tapNum,
       })
       return false
     }
     if (self.data.textArr.length >= self.data.newcar) {
       return false;
     }
     self.data.textArr.push(tapVal);
     self.data.textValue = self.data.textArr.join("");
     self.setData({
       textValue: self.data.textValue,
       keyboardValue: self.data.keyboard2,
       specialBtn: true,
     })
     if (self.data.textArr.length > 1) {
       //展示数字键盘
       self.setData({
         tapNum: true
       })
     }
     console.log(self.data.textValue)
   },
   /**
    * 特殊键盘事件（删除和完成）
    */
   tapSpecBtn: function (e) {
     var self = this;
     if (self.data.flag) {
       return false
     }
     var btnIndex = e.target.dataset.index;
     if (btnIndex == 0) {
       //说明是完成事件
       if (self.data.textArr.length < self.data.newcar) {
         wx.showToast({
           title: '车牌输入错误',
           icon: "loading",
           mask: true,
           duration: 2000
         })
         return
       } else {
         self.setData({
           flag: true
         })
         if (!checkNetWork.checkNetWorkStatu()) {
           console.log('网络错误')
           self.setData({
             flag: false
           })
         } else {
           //开始请求接口
           console.log("开始请求接口")
           wx.showLoading({
             title: '正在绑定',
             mask: true
           })
           wx.getStorage({
             key: 'CELLPHONE',
             success: function (e) {
               console.log(e.data)
               console.log(self.data.textValue)
               console.log(app.data.coupon)
               console.log(self.data.pwd )
               wx.request({
                 url: self.data.b_url,
                 data: {
                   PHONE_NO: e.data + "",
                   PLATE_NO: self.data.textValue + "",
                   COUPON_ID: app.data.coupon + "",
                   USAGE_PWD: self.data.pwd + ""
                 },
                 header: {
                   'content-type': 'application/x-www-form-urlencoded' // 默认值
                 },
                 method: 'POST',
                 success: function (res) {
                   
                   wx.hideLoading()
                   console.log(res)
                   wx.showModal({
                     content: res.data.MSG,
                     showCancel: false,
                     confirmText: "确定",
                     success: function (res) {
                       if (res.confirm) {
                        wx.reLaunch({
                          url: '../home/home',
                        })
                       }
                     }
                   })
                 }
               })
             },
           })
         }
       }
     }
   },
   // 新能源车牌
   switch2Change: function (e) {
     let newval = e.detail.value;
     var _this = this;
     var text = _this.data.textValue
     if (newval == 0) {
       console.log('7位数')
       if (text.length == 8) {
         text = text.substring(0, 7)
         //删除事件
         _this.data.textArr.pop()
       }
       _this.setData({
         newcar: 7,
         textValue: text
       })
     } else {
       console.log("8位数")
       _this.setData({
         newcar: 8,
         textValue: text
       })
 
     }
 
   },
   // 选择器
   bindPickerChange: function (e) {
     this.setData({
       index: e.detail.value,
     })
   },
   // 已有车辆绑定
   oldkey: function () {
     var _this = this
     wx.showLoading({
       title: '正在绑定',
       mask: true
     })
     wx.getStorage({
       key: 'CELLPHONE',
       success: function (e) {
         console.log(e.data)
         console.log(_this.data.array[_this.data.index])
         console.log(app.data.coupon)
         wx.request({
           url: _this.data.b_url,
           data: {
             PHONE_NO: e.data + "",
             PLATE_NO: _this.data.array[_this.data.index] + "",
             COUPON_ID: app.data.coupon + "",
             USAGE_PWD: _this.data.pwd + "",
           },
           header: {
             'content-type': 'application/x-www-form-urlencoded' // 默认值
           },
           method: 'POST',
           success: function (res) {
             console.log(res)
             wx.hideLoading()
             wx.showModal({
               content: res.data.MSG + '',
               showCancel: false,
               confirmText: "确定",
               success: function (res) {
                 if (res.confirm) {
                  wx.reLaunch({
                    url: '../home/home',
                  })
                 }
               }
             })
           }
         })
       },
     })
   },
   // 密码输入
   inputChange: function (e) {
     this.setData({
       pwd: e.detail.value
     })
   },
   // 密码确定
   onConfirm: function () {
     if (this.data.pwd == '') {
       wx.showLoading({
         title: '请输入密码',
       })
       setTimeout(function () {
         wx.hideLoading()
       }, 2000)
     }
     if (this.data.pwd !== this.data.Hpwd) {
       wx.showToast({
         title: '密码错误',
         icon: 'loading',
         duration: 2000
       })
       return;
     }
     else {
       this.setData({
         showModal: false
       })
     }
   },
   //获取绑定的车辆
   getCanvard:function(){
     // 获取车辆信息
     let self = this
     wx.showLoading({
       title: '正在获取绑定车辆',
     })
     wx.getStorage({
       key: 'CELLPHONE',
       success: function (e) {
         wx.request({
           url: app.data.url + '/api/member/memberPlateNumber.shtml',
           data: {
             CELLPHONE: e.data
           },
           method: 'POST',
           success: function (res) {
            wx.hideLoading()
             if (res.data.errcode == 32 || res.data.data.data.length == 0) {
               self.setData({
                 ifcar: false
               })
             } else {
               var arrs = res.data.data.data;
               var cas = []
               for (var i = 0; i < arrs.length; i++) {
                 cas.push(arrs[i].NUMBER)
               }
               self.setData({
                 array: cas,
                 ifcar: true
               })
             }
           }
         })
       }
     });
   }
 })