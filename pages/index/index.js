const TOOLS = require('../../utils/tools.js')
const util = require('../../utils/util.js')

const APP = getApp()

Page({
  data: {
    membershipLevel: '',
    userInfo: '',
    LeavelName: ['','白银会员','黄金会员','白金会员','黑金会员'],
    LeavelClassName: ['','baiyin','huangjin','baijin','heijin'],
    navHeight: [],
    navTop: [],
    news_item: []
  },
  onShow: function(e){
    this.tabBar();
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop
    })
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
          url: url,
          success:function(res){
            res.eventChannel.emit('src',e.currentTarget.dataset.datas)
          }
        })
        return
      }
      wx.switchTab({
        url: url
      })
    }else{
      util.info('功能开发中,敬请期待~')
    }
  }
})