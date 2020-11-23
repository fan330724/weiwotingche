module.exports = {
  //  修改订单状态
    packs:function(states){
      var show = {
          0:'预约未付款',
          1:'预约付款',
          2:'已进场',
          3:'出场未付款',
          4:'已完成',
          5:'预约取消'
      }
      return show[states]
    },
    // 字符串分割， 拆分日期。
    splices:function(date){
      return date.split(" ")[0]
    }
}