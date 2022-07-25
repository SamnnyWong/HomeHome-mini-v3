// pages/oderinfo/oderinfo.js
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    orderInfo: [],
    payflag: true,
    orderStatusList: ['待付款', '已付款', '订单正在备货中','配送中','等待顾客取货','交易成功', '交易关闭','售后中','售后完成'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.id = options.id;
    console.log(this.id)
    util.req(`/homehome/get-order/${options.id}`,'GET').then(e=>{
      console.log(e.data)
      this.orderInfo = e.data;
      this.setData({
        orderInfo: e.data
      })
    })
  },
  jiesuan(e){
    if(this.payflag == false) return
    this.payflag = false;
    var that = this;
    var orderID = e.currentTarget.dataset.orderid;
    util.req('/homehome/request-payment','POST',{
      orderID: orderID
    }).then(success=>{
      console.log(success);
      if(success.data.status != 200) util.info(success.data.message)
      if(success.statusCode != 200) util.info('您已经支付过了')
      wx.requestPayment({
        ...success.data,
        success:function(e){
          console.log(e)
          if(e.errMsg == 'requestPayment:ok'){
            console.log(that.orderInfo)
            that.orderInfo['orderStatus'] = 1;
            console.log(that.orderInfo)
            that.setData({
              orderInfo: that.orderInfo
            })
            that.payflag = true;
            util.info('支付成功','success')
            util.req('/homehome/confirm-payment','POST',{
              orderID: orderID
            }).then(e=>{
              that.orderID = '';
              console.log(e)
            })
          }
        },
        fail: function(err){
          console.log(err)
          that.payflag = true;
        }
      })
    })
  },
  fuzhi(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.setClipboardData({
      data: id,
      success: res=>{
        util.info('复制成功')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})