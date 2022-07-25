const util = require("../../utils/util");

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: false,
    telphone: '',
    userInfo: [],
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  nologin(){
    wx.navigateBack({
      delta: 1
    })
  },
  getStatus(){
    if(!this.checked){
      util.info('请阅读并勾选页面底部协议')
    }
  },
  getPhoneNumber(e){
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      console.log(e.detail.code)
      util.req(`/homehome/get-phone-info/${e.detail.code}`,'GET').then(e=>{
        if(e.statusCode != 200){
          util.info('授权失败,请重新授权')
          return;
        }
        this.telphone = parseInt(e.data.data.phone_info.phoneNumber)
        this.setData({
          loginInfo: true
        })
      })
    }else{
      this.setData({
        loginInfo: false
      })
    }
  },
  GotoAgreement(){
    util.jump('/pages/agreement/agreement',0)
  },
  checkboxChange(e){
    this.checked = e.detail.value[0]?true:false;
    this.setData({
      checked: e.detail.value[0]?true:false
    })
  },
  noModel(){
    util.info('授权失败')
    this.setData({
      loginInfo: false
    })
  },
  getUserInfo(){
    var that = this;
    wx.getUserProfile({
      desc: '获取你的会员信息',
      success:function(e){
        that.userInfo = e.rawData;
        util.store('userInfo', JSON.parse(e.rawData));
        console.log(that.telphone)
        util.req('/cas/homehome/login','POST',{
          code: util.get('code'),
          phoneNumber: that.telphone,
          userInfo: e.rawData,
          userName: e.userInfo.nickName
        }).then(e=>{
          console.log(e)
          if(e.statusCode == 200){
            util.store('token', e.data.homehomeToken);
            util.store('Info', {
              userID: e.data.userID,
              userInfo: e.data.userInfo,
              telphone: that.telphone,
              membershipLevel: e.data.membershipLevel
            });
            util.jump('/pages/xxx/xxx',-1)
            util.info('登录成功')
            return
          }
        })
      },fail:function(e){
        console.log(e)
        util.info('授权失败')
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
    wx.login().then(e=>{
      console.log(e.code)
      util.store('code', e.code)
    })
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