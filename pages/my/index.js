const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth');
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
        type: 'url'
      },
      {
        name: "关于我们",
        icon: "setting-o",
        navUrl: "/pages/about/index",
        type: 'url'
      },
      {
        name: "当前版本",
        icon: "setting-o",
        navUrl: "",
        type: 'banben'
      },
      {
        name: "清除缓存",
        icon: "setting-o",
        navUrl: "",
        type: 'huancun'
      }
    ],
    balance:0.00,
    freeze:0,
    score:0,
    growth:0,
    score_sign_continuous:0,
    rechargeOpen: false, // 是否开启充值[预存]功能
    openID:'',
    userID: "",
    // 用户订单统计数据
    count_id_no_confirm: 0,
    count_id_no_pay: 0,
    count_id_no_reputation: 0,
    count_id_no_transfer: 0,
    membershipLevel: '',
    // 判断有没有用户详细资料
    userInfoStatus: 0, // 0 未读取 1 没有详细信息 2 有详细信息
    LeavelName: ['','白银','黄金','白金','黑金']
  },
	onLoad() {
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
	},
  onShow() {
    this.setData({
      membershipLevel: wx.getStorageSync('membershipLevel'),
      version: CONFIG.version,
      userID: wx.getStorageSync('userID')
    })
    this.tabBar();
    this.setData({
      openID : wx.getStorageSync('openID')
    })
    const _this = this
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        _this.getUserApiInfo();   // 获取基本信息
        _this.getUserAmount();    // 获取用户余额、积分、会员等级
        _this.orderStatistics();  // 获取订单数据
        _this.cardMyList();       // 获取购物车数据
      } else {
        AUTH.authorize().then(res => {
          AUTH.bindSeller()
          _this.getUserApiInfo();
          _this.getUserAmount();
          _this.orderStatistics();
          _this.cardMyList();
        })
      }
    })
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  readConfigVal() {
    this.setData({
      order_hx_uids: wx.getStorageSync('order_hx_uids'),
      cps_open: wx.getStorageSync('cps_open'),
      recycle_open: wx.getStorageSync('recycle_open'),
      show_3_seller: wx.getStorageSync('show_3_seller'),
      show_quan_exchange_score: wx.getStorageSync('show_quan_exchange_score'),
      show_score_exchange_growth: wx.getStorageSync('show_score_exchange_growth'),
      show_score_sign: wx.getStorageSync('show_score_sign'),
      fx_type: wx.getStorageSync('fx_type'),
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
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    console.log(res.data)
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      if (res.data.base.mobile) {
        _data.userMobile = res.data.base.mobile
      }
      if (res.data.base.nick && res.data.base.avatarUrl) {
        _data.userInfoStatus = 2
      } else {
        _data.userInfoStatus = 1
      }
      if (this.data.order_hx_uids && this.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
        _data.canHX = true // 具有扫码核销的权限
      }
      const adminUserIds = wx.getStorageSync('adminUserIds')
      if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
        _data.isAdmin = true
      }
      if (res.data.peisongMember && res.data.peisongMember.status == 1) {
        _data.memberChecked = false
      } else {
        _data.memberChecked = true
      }
      console.log(_data)
      this.setData(_data);
    }
  },
  async memberCheckedChange() {
    const res = await WXAPI.peisongMemberChangeWorkStatus(wx.getStorageSync('token'))
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      this.getUserApiInfo()
    }
  },
  getUserAmount: function () {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score,
          growth: res.data.growth
        });
      }
    })
  },
  handleOrderCount: function (count) {
    return count > 99 ? '99+' : count;
  },
  orderStatistics: function () {
    WXAPI.orderStatistics(wx.getStorageSync('token')).then((res) => {
      if (res.code == 0) {
        const {
          count_id_no_confirm,
          count_id_no_pay,
          count_id_no_reputation,
          count_id_no_transfer,
        } = res.data || {}
        this.setData({
          count_id_no_confirm: this.handleOrderCount(count_id_no_confirm),
          count_id_no_pay: this.handleOrderCount(count_id_no_pay),
          count_id_no_reputation: this.handleOrderCount(count_id_no_reputation),
          count_id_no_transfer: this.handleOrderCount(count_id_no_transfer),
        })
      }
    })
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
  updateUserInfo(e) {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: res => {
        console.log(res);
        this._updateUserInfo(res.userInfo)
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  async _updateUserInfo(userInfo) {
    AUTH.wxaCode().then(res1 => {
      console.log(res1)
      AUTH.getSession(res1).then(res2 => {
        console.log(res2)
        wx.setStorageSync('openID', res2.data.testData.openid)
      })
    })
    const postData = {
      token: wx.getStorageSync('token'),
      nick: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      province: userInfo.province,
      gender: userInfo.gender,
    }
    const res = await WXAPI.modifyUserInfo(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '登陆成功',
    })
    this.getUserApiInfo()
  },
  gogrowth() {
    wx.navigateTo({
      url: '/pages/score/growth',
    })
  },
  async cardMyList() {
    const res = await WXAPI.cardMyList(wx.getStorageSync('token'))
    if (res.code == 0) {
      const myCards = res.data.filter(ele => { return ele.status == 0 })
      if (myCards.length > 0) {
        this.setData({
          myCards: res.data
        })
      }
    }
  },
  async renew() {
    wx.login({
    success(loginRes) {
      if (loginRes.code) {
        console.log(loginRes.code)
      } else {
        console.error('登录失败！' + loginRes.errMsg)
      }
    }
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
  async _getPhoneNumber(e) {
    let res
    const extConfigSync = wx.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: wx.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv)
    }
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    if (res.code === 10002) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      })
      this.getUserApiInfo();
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false
      })
    }
  }
})