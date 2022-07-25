<<<<<<< HEAD
const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
=======
const TOOLS = require('../../utils/tools.js')
>>>>>>> 7178bb9 (1.0.0正式版)
const util = require('../../utils/util.js')

const APP = getApp()

Page({
  data: {
    membershipLevel: '',
    userInfo: '',
    LeavelName: ['','白银会员','黄金会员','白金会员','黑金会员'],
    LeavelClassName: ['','baiyin','huangjin','baijin','heijin'],
    navHeight: [],
<<<<<<< HEAD
    navTop: []
=======
    navTop: [],
    news_item: []
>>>>>>> 7178bb9 (1.0.0正式版)
  },
  onShow: function(e){
    this.tabBar();
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop
    })
<<<<<<< HEAD
  },
  onLoad: function(e) {
    
    wx.login({
      success: function(params) {
        console.log(params)
      }
    })
    const that = this
    // 读取分享链接中的邀请人编号
    if (e && e.inviter_id) {
      wx.setStorageSync('referrer', e.inviter_id)
    }
    // 读取小程序码中的邀请人编号
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {        
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    // 静默式授权注册/登陆
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.authorize().then( aaa => {
          AUTH.bindSeller()
          TOOLS.showTabBarBadge()
          this.getUserApiInfo().then(e=>{
            this.setData({
              userInfo: e
            })
          })
          this.setData({
            membershipLevel: wx.getStorageSync('membershipLevel')
          })
        })
      } else {
        this.getUserApiInfo().then(e=>{
          this.setData({
            userInfo: e
          })
        })
        this.setData({
          membershipLevel: wx.getStorageSync('membershipLevel')
        })
        AUTH.bindSeller()
        TOOLS.showTabBarBadge()
      }
    })
    // this.setData({
    //   membershipLevel: wx.getStorageSync('membershipLevel')
    // })
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    // WXAPI.goodsv2({
    //   recommendStatus: 1
    // }).then(res => {
    //   if (res.code === 0){
    //     that.setData({
    //       goodsRecommend: res.data.result
    //     })
    //   }      
    // })
=======
    util.req('/homehome/get-article-list').then(e=>{
      var news_item = e.data.data[0].content['news_item'];
      this.setData({
        news_item : news_item
      })
      this.news_item = news_item
    })
    this.setData({
      membershipLevel: util.get('Info').membershipLevel,
      userInfo: JSON.parse(util.get('Info').userInfo)
    })
  },
  onLoad: function(e) {
    var that=this;
    wx.login().then(e=>{
      util.req('/cas/homehome/login/'+e.code,'GET').then(e=>{
        console.log(e)
        if(e.statusCode != 200){
          wx.clearStorageSync();
          that.setData({
            membershipLevel: '',
            userInfo: ''
          })
          return
        }
        if(e.statusCode == 200){
          console.log(e.data)
          util.store('token', e.data.homehomeToken);
          util.store('Info', {
            userID: e.data.userID,
            userInfo: e.data.userInfo,
            telphone: e.data.phoneNumber,
            membershipLevel: e.data.membershipLevel
          });
          that.setData({
            membershipLevel: util.get('Info').membershipLevel,
            userInfo: JSON.parse(util.get('Info').userInfo)
          })
        }
      })
      util.store('code', e.code)
    })
  },
  navToMap(){
    wx.openLocation({
      latitude: 35.105572,
      longitude: 118.393758,
      name: 'HOMEHOME五金家居便利店(奥正店)',
      address: '山东省临沂市河东区奥正诚园南区北门入口处C5-108号'
    })
>>>>>>> 7178bb9 (1.0.0正式版)
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setCount(TOOLS.showTabBarBadge());
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  navTo(e){
    var url = e.currentTarget.dataset.url;
    if(url){
      if(e.currentTarget.dataset.type == 'navTo'){
        wx.navigateTo({
<<<<<<< HEAD
          url: url
=======
          url: url,
          success:function(res){
            res.eventChannel.emit('src',e.currentTarget.dataset.datas)
          }
>>>>>>> 7178bb9 (1.0.0正式版)
        })
        return
      }
      wx.switchTab({
        url: url
      })
    }else{
      util.info('功能开发中,敬请期待~')
    }
<<<<<<< HEAD
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    console.log(res.data)
    if (res.code == 0) {
      return res.data.base;
    }
  },
=======
  }
>>>>>>> 7178bb9 (1.0.0正式版)
})