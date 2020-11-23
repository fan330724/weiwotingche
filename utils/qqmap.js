const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  // 腾讯地图  个人配置的key;
  key: 'UOQBZ-IGPCV-HNGPE-U6BIS-BCY66-PKFH6'
});
module.exports = {
  //逆解析地址
  nimap: function (latitude, longitude,cb) {
    //地址逆解析获取cityname
    qqmapsdk.reverseGeocoder({
      location: {
        latitude:latitude,
        longitude:longitude
      },
      success: function (res) {
        return cb(res)
      },
    })
  },
  //获取关键词提示
  input:function(value,city,cb){
     qqmapsdk.getSuggestion({
      keyword:value,
      region: city,
      
      success: function (res) {
        return cb(res)
      }
     })
  },
  //解析地址
  dimap(address,cb){
    qqmapsdk.geocoder({
      address,
      success:(res)=>{
        return cb(res)
      }
    })
  }
}
