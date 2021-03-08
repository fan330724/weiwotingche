// components/discount-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String
    },
    list:{
      type:Object
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
    todetails(e){
      // console.log(e)
      var {id,title} = e.currentTarget.dataset
      // console.log(title)
      if(title == '洗车列表'){
        title = '洗车门店'
      }else{
        title = '停车场'
      }
      let getlist = JSON.stringify(e.currentTarget.dataset.getlist)
      this.triggerEvent('todetails',{'id':id,'title':title,'getlist':getlist})
      // wx.navigateTo({
      //   url: `../../pages/discount-detail/discount-detail?id=${id}&title=${title}&getlist=${getlist}`,
      // })
    }
  }
})
