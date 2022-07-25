const tools = require('../../utils/tools.js');
const util = require('../../utils/util');
const CONFIG = require('../../config.js')

Page({
	data: {
    gongneng: [
      {
        name: "手机号绑定",
        icon: "phone-o",
        navUrl: "",
        type: 'button'
      },
      // {
      //   name: "收货地址",
      //   icon: "location-o",
      //   navUrl: "/pages/select-address/index",
      //   type: 'url'
      // },
      {
        name: "联系客服",
        icon: "service-o",
        navUrl: "",
        type: 'kefu'
      },
      {
        name: "当前版本",
        icon: "info-o",
        navUrl: "",
        type: 'banben'
      },
      {
        name: "清除缓存",
        icon: "setting-o",
        navUrl: "",
        type: 'huancun'
      },
      {
        name: "关于我们",
        icon: "friends-o",
        navUrl: "/pages/about/index",
        type: 'url'
      }
    ],
    balance:0.00,
    freeze:0,
    score:0,
    growth:0,
    telphone: '',
    userInfo: {
      avatarUrl: "/images/profile-head.jpg",
      nickName: "未登录"
    },
    score_sign_continuous:0,
    rechargeOpen: false, // 是否开启充值[预存]功能
    openID:'',
    userID: "",
    // 用户订单统计数据
    count_id_no_confirm: 0,
    count_id_no_pay: 0,
    count_id_no_reputation: 0,
    count_id_no_transfer: 0,
    membershipLevel: 0,
    // 判断有没有用户详细资料
    userInfoStatus: 0, // 0 未读取 1 没有详细信息 2 有详细信息
    LeavelClassName: ['','baiyin','huangjin','baijin','heijin'],
    LeavelName: ['未登录','白银','黄金','白金','黑金']
  },
	onLoad() {
	},
  onShow() {
    this.tabBar();
    this.getlogin();
  },
  getlogin(){
    this.setData({
      version: CONFIG.version
    })
    this.setData({
      membershipLevel: util.get('Info').membershipLevel,
      telphone: util.get('Info').telphone,
      userInfo: JSON.parse(util.get('Info').userInfo),
      userID: util.get('Info').userID
    })
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setCount(tools.showTabBarBadge());
      this.getTabBar().setData({
        selected: 4
      })
    }
  },
  navToRe(e){
    var data = e.currentTarget.dataset;
    if(data.type == 'huancun'){
      this.clearStorage();
    }
    if(data.type == 'url'){
      if(!data.url){
        util.info("功能开发中,敬请期待~")
        return;
      }
      wx.navigateTo({
        url: data.url,
      })
    }
  },
  handleOrderCount: function (count) {
    return count > 99 ? '99+' : count;
  },
  goAsset: function () {
    wx.navigateTo({
      url: "/pages/asset/index"
    })
  },
  goScore: function () {
    wx.navigateTo({
      url: "/pages/score/index"
    })
  },
  goOrder: function (e) {
    wx.navigateTo({
      url: "/pages/order-list/index?type=" + e.currentTarget.dataset.type
    })
  },
  scanOrderCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.navigateTo({
          url: '/pages/order-details/scan-result?hxNumber=' + res.result,
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  gogrowth() {
    wx.navigateTo({
      url: '/pages/score/growth',
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    this._getPhoneNumber(e)
  },
  clearStorage(){
    wx.clearStorageSync()
    wx.showToast({
      title: '已清除',
      icon: 'success'
    })
  },
})