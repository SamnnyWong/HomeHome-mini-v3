const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const util = require('../../utils/util.js')

const APP = getApp()

Page({
  data: {
    membershipLevel: '',
    userInfo: '',
    LeavelName: ['','白银会员','黄金会员','白金会员','黑金会员'],
    LeavelClassName: ['','baiyin','huangjin','baijin','heijin'],
    navHeight: [],
    navTop: []
  },
  onShow: function(e){
    this.tabBar();
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop
    })
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
          url: url
        })
        return
      }
      wx.switchTab({
        url: url
      })
    }else{
      util.info('功能开发中,敬请期待~')
    }
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    console.log(res.data)
    if (res.code == 0) {
      return res.data.base;
    }
  },
})