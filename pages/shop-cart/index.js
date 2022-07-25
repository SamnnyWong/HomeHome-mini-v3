<<<<<<< HEAD
const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const tools = require('../../utils/tools.js')

const app = getApp()
=======
const TOOLS = require('../../utils/tools.js')
const tools = require('../../utils/tools.js')
const util = require('../../utils/util.js')
>>>>>>> 7178bb9 (1.0.0正式版)

Page({
  data: {
    shopCarType: 0, //0自营 1云货架
    saveHidden: true,
    allSelect: true,
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
<<<<<<< HEAD
    shippingCarInfo:[]
=======
    shippingCarInfo:[],
    orderID: '',
    payflag: true
>>>>>>> 7178bb9 (1.0.0正式版)
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth
      var scale = (750 / 2) / (w / 2)
<<<<<<< HEAD
      // console.log(scale);
=======
>>>>>>> 7178bb9 (1.0.0正式版)
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function () {
<<<<<<< HEAD
    this.initEleWidth();
    this.onShow();
    // this.setData({
    //   shopping_cart_vop_open: wx.getStorageSync('shopping_cart_vop_open')
    // })
  },
  onShow: function () {
    this.tabBar() ;
    this.shippingCarInfo()
=======
    // this.setData({
    //   shopping_cart_vop_open: wx.getStorageSync('shopping_cart_vop_open')
    // })
    this.initEleWidth();
  },
  onShow: function () {
    this.shippingCarInfo();
    this.tabBar() ;
  },
  settlement(){
    console.log(util.get('goodsList'))
    if(this.payflag == false) return
    if(util.get('goodsList').length == 0) {
      util.info('您还没有选择商品')
      return
    }
    this.payflag = false;
    var that = this;
    console.log(this.data.shippingCarInfo)
    this.data.shippingCarInfo['items'].forEach(e=>{
      //TODO
      e['category'] = e.level2 || e.brand;
      if(e['brand'] == undefined){
        e['brand'] = e['category']
      }
      e['uuid'] = e.id;
      e['amount'] = e.number;
      if(e['leave2'] == undefined){
        e['level2'] = e.brand || e.category;
      }
    })
    console.log(this.data.shippingCarInfo['items'])
    util.req('/homehome/create-order','POST',{
      items: this.data.shippingCarInfo['items'],
      orderSum: this.data.shippingCarInfo.price,
      userName: JSON.parse(util.get('Info').userInfo).nickName
    }).then(e=>{
      console.log(e)
      that.orderID = e.data.orderID;
      util.req('/homehome/request-payment','POST',{
        orderID: that.orderID
      }).then(success=>{
        console.log(success);
        wx.requestPayment({
          ...success.data,
          success:function(e){
            console.log(e)
            if(e.errMsg == 'requestPayment:ok'){
              that.setData({
                shippingCarInfo: []
              })
              wx.setStorageSync('goodsList', [])
              util.info('支付成功','success')
              util.req('/homehome/confirm-payment','POST',{
                orderID: that.orderID
              }).then(e=>{
                console.log(e)
              })
              setTimeout(() => {
                that.payflag = true;
                wx.navigateTo({
                  url: `/pages/oderinfo/oderinfo?id=${that.orderID}`
                })
              }, 1000);
            }
          },
          fail: function(err){
            console.log(err)
            that.setData({
              shippingCarInfo: []
            })
            wx.setStorageSync('goodsList', [])
            util.info('支付失败','error')
            setTimeout(() => {
              that.payflag = true;
              wx.navigateTo({
                url: `/pages/oderinfo/oderinfo?id=${that.orderID}`
              })
            }, 1000);
          }
        })
      })
    })
    // util.req('/homehome/create-order','POST',{
    //   items: this.shippingCarInfo['items'],
    //   orderSum: this.shippingCarInfo.price
    // }).then(e=>{
    //   console.log(e)
    // })
>>>>>>> 7178bb9 (1.0.0正式版)
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setCount(tools.showTabBarBadge());
      this.getTabBar().setData({
        selected: 3
      })
    }
  },
  async shippingCarInfo() {
    const token = wx.getStorageSync('token')
<<<<<<< HEAD
=======
    console.log(token)
>>>>>>> 7178bb9 (1.0.0正式版)
    if (!token) {
      return
    }
    // if (this.data.shopCarType == 0) { //自营购物车
    //   var res = await WXAPI.shippingCarInfo(token)
    // } else if (this.data.shopCarType == 1) { //云货架购物车
    //   var res = await WXAPI.jdvopCartInfo(token)
    // }
    // console.log(res)

    // 建立商品数据适应格式
    let res = {
      items:[],
      goodsStatus: [],
      price: 0,
      score: 0,
      shopList: [
        {
          'id': 0,
          'name': '全部'
        }
      ]
    }
    res.items = wx.getStorageSync('goodsList')
    console.log(res)
    for(var i = 0; i<res.items.length ; i++){
      res.price += (res.items[i].retailPrice)*(res.items[i].number)
    }
<<<<<<< HEAD
    this.setData({
      shippingCarInfo: res,
    })
    console.log('shippingCarInfo')
=======
    res.price = res.price.toFixed(2);
    this.data.shippingCarInfo = res;
    this.setData({
      shippingCarInfo: res,
    })
>>>>>>> 7178bb9 (1.0.0正式版)
    console.log(this.data.shippingCarInfo)
    // if (res.code == 0) {
    //   if (this.data.shopCarType == 0) //自营商品
    //   {
    //     res.data.items.forEach(ele => {
    //       if (!ele.stores || ele.status == 1) {
    //         ele.selected = false
    //       }
    //     })
    //   }
    //   this.setData({
    //     shippingCarInfo: res.data
    //   })
    //   console.log(this.data.shippingCarInfo)
    // } else {
    //   this.setData({
    //     shippingCarInfo: null
    //   })
    // }
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    const index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },
<<<<<<< HEAD

=======
>>>>>>> 7178bb9 (1.0.0正式版)
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },
  delItem: function(e){
<<<<<<< HEAD
    console.log(e.currentTarget.dataset)
    const key = e.currentTarget.dataset
    this.delItemDone(key);
  },
  async delItemDone(index) {
=======
    console.log(e)
    const key = e.currentTarget.dataset.key;
    this.delItemDone(key);
  },
  async delItemDone(index) {
    console.log(index)
>>>>>>> 7178bb9 (1.0.0正式版)
    let goodsList = wx.getStorageSync('goodsList')
    goodsList.splice(index, 1)
    wx.setStorageSync('goodsList', goodsList)
    this.shippingCarInfo()
    TOOLS.showTabBarBadge()
    // const token = wx.getStorageSync('token')
    // if(this.data.shopCarType == 0){
    //   var res = await WXAPI.shippingCarInfoRemoveItem(token, key)
    // }
    // if(this.data.shopCarType == 1){
    //   var res = await WXAPI.jdvopCartRemove(token, key)
    // }
    // if (res.code != 0 && res.code != 700) {
    //   wx.showToast({
    //     title: res.msg,
    //     icon: 'none'
    //   })
    // } else {
      // this.shippingCarInfo()
      // TOOLS.showTabBarBadge()
    // }
  },
  async jiaBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    // const item = this.data.shippingCarInfo.items[index]
    let goodsList = wx.getStorageSync('goodsList')
    goodsList[index].number++
    wx.setStorageSync('goodsList', goodsList)
    tools.showTabBarBadge();
    // const token = wx.getStorageSync('token')
    // if(this.data.shopCarType == 0){
    //   var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    // }
    // else if(this.data.shopCarType == 1){
    //   var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)
    // }    
    this.shippingCarInfo()
  },
  async jianBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number - 1
    console.log(index)
    console.log(item)
    if (number <= 0) {
      // 弹出删除确认
      wx.showModal({
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            this.delItemDone(index)
          }
        }
      })
      return
    }
    let goodsList = wx.getStorageSync('goodsList')
    goodsList[index].number--
    wx.setStorageSync('goodsList', goodsList)
    tools.showTabBarBadge();
    // if(this.data.shopCarType == 0)
    // {
    //   var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)  
    // }
    // if(this.data.shopCarType == 1)
    // {
    //   var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)  
    // }
    this.shippingCarInfo()
  },
  changeCarNumber(e) {
    const key = e.currentTarget.dataset.key
    const num = e.detail.value
<<<<<<< HEAD
=======
    console.log(key)
>>>>>>> 7178bb9 (1.0.0正式版)
    const token = wx.getStorageSync('token')
    if(this.data.shopCarType == 0){
    WXAPI.shippingCarInfoModifyNumber(token, key, num).then(res => {
      this.shippingCarInfo()
    })}
    else if(this.data.shopCarType == 1){
      WXAPI.jdvopCartModifyNumber(token, key, num).then(res => {
        this.shippingCarInfo()
      })
    }
  },
  async radioClick(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.shippingCarInfo.items[index]
    const token = wx.getStorageSync('token')
    if (this.data.shopCarType == 0) { //自营购物车
      if (!item.stores || item.status == 1) {
        return
      }
      var res = await WXAPI.shippingCartSelected(token, item.key, !item.selected)
    } else if (this.data.shopCarType == 1) { //云货架购物车
      var res = await WXAPI.jdvopCartSelect(token, item.key, !item.selected)
    }
    this.shippingCarInfo()
  },
  onChange(event) {
    this.setData({
      shopCarType: 0
    })
    this.shippingCarInfo()
  }
})