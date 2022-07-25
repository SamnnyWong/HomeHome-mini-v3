const util = require('../../utils/util');
const tools = require('../../utils/tools.js');
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeCategory: 0,
    categorySelected: {
      name: '',
      id: ''
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0,
    skuCurGoods: undefined,
    page: 1,
    pageSize: 20
  },
  onShow() {
    this.tabBar() ;
    const _categoryId = wx.getStorageSync('_categoryId')
    wx.removeStorageSync('_categoryId')
    if (_categoryId) {
      this.data.categorySelected.id = _categoryId
      this.categories();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      categoryMod: wx.getStorageSync('categoryMod')
    })
    this.categories();
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setCount(tools.showTabBarBadge());
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  async getGoodsListReq(categoryID) {
    var token = wx.getStorageSync('homehomeToken')
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://service-q3ksz16x-1304578354.sh.apigw.tencentcs.com/release/homehome/get-item-by-category/${categoryID}`,
        header: {
          "authorization":"bearer "+token
        },
        method: 'GET',
        success: function (res) {
          return resolve(res)
        },
        fail: function (res) {
          return resolve(res)
        }
      })
    })
  },
  async categories() {
    var that =this;
    // const res = await WXAPI.goodsCategory()
    util.req('/homehome/get-category','GET').then(e=>{
      var res = e;
      let activeCategory = 0
      let categorySelected = this.data.categorySelected
      if (res.statusCode == 200) {
        const categories = res.data.filter(ele => {
          return !ele.vopCid1 && !ele.vopCid2
        })
        // categories.forEach(p => {
        //   p.childs = categories.filter(ele => {
        //     return p.id == ele.pid
        //   })
        // })
        const firstCategories = categories.filter(ele => {
          return res.data[0]
        })
        if (this.data.categorySelected.id) {
          activeCategory = firstCategories.findIndex(ele => {
            return ele.id == this.data.categorySelected.id
          })
          categorySelected = firstCategories[activeCategory]
        } else {
          categorySelected = firstCategories[0]
        }
        // const resAd = await WXAPI.adPosition('category_' + categorySelected.id)
        // let adPosition = null
        // if (resAd.code === 0) {
        //   adPosition = resAd.data
        // }
        this.setData({
          page: 1,
          activeCategory,
          categories,
          firstCategories,
          categorySelected,
          // adPosition
        })
        this.getGoodsList()
      }
    })
    // console.log(res)
  },
  async getGoodsList() {
    if (this.data.categoryMod == 2) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    // secondCategoryId
    let categoryID = ''
    if (this.data.secondCategoryId) {
      categoryID = this.data.secondCategoryId
    } else if (this.data.categorySelected.id) {
      categoryID = this.data.categorySelected.id
    }

    // console.log(categoryID)
    let res = await this.getGoodsListReq(categoryID)
    // console.log(res)
    this.setData({
      currentGoods: res.data
      // currentGoods: res.data.slice(0,1)
    })
    wx.hideLoading()
  },
  async onCategoryClick(e) {
    const idx = e.target.dataset.idx
    console.log(e.target)
    if (idx == this.data.activeCategory) {
      this.setData({
        scrolltop: 0,
      })
      return
    }
    const categorySelected = this.data.firstCategories[idx]
    console.log(categorySelected)
    // const res = await WXAPI.adPosition('category_' + categorySelected.id)
    // let adPosition = null
    // if (res.code === 0) {
    //   adPosition = res.data
    // }
    this.setData({
      page: 1,
      secondCategoryId: '',
      activeCategory: idx,
      categorySelected,
      scrolltop: 0,
    });
    this.getGoodsList();
  },
  onSecondCategoryClick(e) {
    const idx = e.detail.index
    let secondCategoryId = ''
    if (idx) {
      // 点击了具体的分类
      secondCategoryId = this.data.categorySelected.childs[idx - 1].id
    }
    this.setData({
      page: 1,
      secondCategoryId
    });
    this.getGoodsList();
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  onShareAppMessage() {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  async addShopCar(e) {
    console.log(this.data.currentGoods)
    const curGood = this.data.currentGoods.find(ele => {
      return ele.id == e.currentTarget.dataset.id
    })
    if (!curGood) {
      return
    }
    if (curGood.stores <= 0) {
      wx.showToast({
        title: '已售罄~',
        icon: 'none'
      })
      return
    }
    // console.log(curGood)
    this.addShopCarCheck({
      goods: curGood,
      buyNumber: 1,
      sku: []
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
  async addShopCarCheck(options) {
    this.addShopCarDone(options)
  },
  async addShopCarDone(options) {
    // const res = await WXAPI.shippingCarInfoAddItem(wx.getStorageSync('token'), options.goodsId, options.buyNumber, options.sku)
    // 为原数据增加属性
    console.log(options)
    options.goods.number = 1
    options.goods.selected = true
    options.goods.shopId = 0
    let goodsList = wx.getStorageSync('goodsList')
    if(goodsList.length >= 10){
      util.info('订单的货品数量不能超过10个')
      return
    }
    for(let i = 0; i<goodsList.length; i++){
      if(goodsList[i].id == options.goods.id){
        goodsList[i].number +=1
        wx.setStorageSync('goodsList', goodsList)
        // console.log(util.get('goodsList'))
        wx.showToast({
          title: '加入成功',
          icon: 'success'
        })
        this.setData({
          skuCurGoods: null,
          skuCurGoodsShow: false
        })
        TOOLS.showTabBarBadge()
        return
      }
    }
    goodsList = goodsList.concat(options.goods)
    wx.setStorageSync('goodsList', goodsList)
    // console.log(res)
    // if (res.code == 30002) {
    //   // 需要选择规格尺寸
    //   const skuCurGoodsRes = await WXAPI.goodsDetail(options.goodsId)
    //   if (skuCurGoodsRes.code != 0) {
    //     wx.showToast({
    //       title: skuCurGoodsRes.msg,
    //       icon: 'none'
    //     })
    //     return
    //   }
    //   wx.hideTabBar()
    //   const skuCurGoods = skuCurGoodsRes.data
    //   skuCurGoods.basicInfo.storesBuy = 1
    //   this.setData({
    //     skuCurGoods,
    //     skuGoodsPic: skuCurGoods.basicInfo.pic,
    //     selectSizePrice: skuCurGoods.basicInfo.minPrice,
    //     selectSizeOPrice: skuCurGoods.basicInfo.originalPrice,
    //     skuCurGoodsShow: true
    //   })
    //   return
    // }
    // if (res.code != 0) {
    //   wx.showToast({
    //     title: res.msg,
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.showToast({
      title: '加入成功',
      icon: 'success'
    })
    this.setData({
      skuCurGoods: null,
      skuCurGoodsShow: false
    })
    TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
  },
  storesJia() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
      skuCurGoods.basicInfo.storesBuy++
      this.setData({
        skuCurGoods
      })
    }
  },
  storesJian() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy > 1) {
      skuCurGoods.basicInfo.storesBuy--
      this.setData({
        skuCurGoods
      })
    }
  },
  closeSku() {
    this.setData({
      skuCurGoods: null,
      skuCurGoodsShow: false
    })
    wx.showTabBar()
  },
  skuSelect(e) {
    const pid = e.currentTarget.dataset.pid
    const id = e.currentTarget.dataset.id
    // 处理选中
    const skuCurGoods = this.data.skuCurGoods
    const property = skuCurGoods.properties.find(ele => {
      return ele.id == pid
    })
    let child
    property.childsCurGoods.forEach(ele => {
      if (ele.id == id) {
        ele.active = true
        child = ele
      } else {
        ele.active = false
      }
    })
    // 显示图片
    let skuGoodsPic = this.data.skuGoodsPic
    if (skuCurGoods.subPics && skuCurGoods.subPics.length > 0) {
      const _subPic = skuCurGoods.subPics.find(ele => {
        return ele.optionValueId == child.id
      })
      if (_subPic) {
        skuGoodsPic = _subPic.pic
      }
    }
    this.setData({
      skuCurGoods,
      skuGoodsPic
    })
    // 计算价格
    this.calculateGoodsPrice()
  },
  async calculateGoodsPrice() {
    // 计算最终的商品价格
    let price = this.data.skuCurGoods.basicInfo.minPrice
    let originalPrice = this.data.skuCurGoods.basicInfo.originalPrice
    let totalScoreToPay = this.data.skuCurGoods.basicInfo.minScore
    let buyNumMax = this.data.skuCurGoods.basicInfo.stores
    let buyNumber = this.data.skuCurGoods.basicInfo.minBuyNumber
    // 计算 sku 价格
    const needSelectNum = this.data.skuCurGoods.properties.length
    let curSelectNum = 0;
    let propertyChildIds = "";
    let propertyChildNames = "";
    this.data.skuCurGoods.properties.forEach(p => {
      p.childsCurGoods.forEach(c => {
        if (c.active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
          propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
        }
      })
    })
    let canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    const token = wx.getStorageSync('token')
    if (canSubmit) {
      const res = await WXAPI.goodsPriceV2({
        token: token ? token : '',
        goodsId: this.data.skuCurGoods.basicInfo.id,
        propertyChildIds: propertyChildIds
      })
      if (res.code == 0) {
        price = res.data.price
        originalPrice = res.data.originalPrice
        totalScoreToPay = res.data.score
        buyNumMax = res.data.stores
      }
    }
    this.setData({
      selectSizePrice: price,
      selectSizeOPrice: originalPrice,
      totalScoreToPay: totalScoreToPay,
      buyNumMax,
      buyNumber: (buyNumMax >= buyNumber) ? buyNumber : 0
    });
  },
  addCarSku() {
    const skuCurGoods = this.data.skuCurGoods
    const propertySize = skuCurGoods.properties.length // 有几组SKU
    const sku = []
    skuCurGoods.properties.forEach(p => {
      const o = p.childsCurGoods.find(ele => {
        return ele.active
      })
      if (!o) {
        return
      }
      sku.push({
        optionId: o.propertyId,
        optionValueId: o.id
      })
    })
    if (sku.length != propertySize) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }
    const options = {
      goodsId: skuCurGoods.basicInfo.id,
      buyNumber: skuCurGoods.basicInfo.storesBuy,
      sku
    }
    this.addShopCarDone(options)
  },
  goodsGoBottom() {
    this.data.page++
    this.getGoodsList()
  },
  adPositionClick(e) {
    const url = e.target.dataset.url
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },
  searchscan() {
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: res => {
        this.setData({
          inputVal: res.result
        })
        wx.navigateTo({
          url: '/pages/goods/list?name=' + res.result,
        })
      }
    })
  }
})