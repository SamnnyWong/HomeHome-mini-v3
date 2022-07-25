const WXAPI = require('apifm-wxapi')

// 显示购物车tabBar的Badge
function showTabBarBadge(noTabBarPage){
  const token = wx.getStorageSync('token')
  if (!token) {
    return 0
  }
  let number = 0
  // 自营商品
  // let res = await WXAPI.shippingCarInfo(token)
  const res = wx.getStorageSync('goodsList')
  for(let i = 0; i<res.length;i++){
    number += res[i].number
  }
  
  
  // // vop 购物车
  // res = await WXAPI.jdvopCartInfo(token)
  // if (res.code == 0) {
  //   number += res.data.number
  // }
  if (!noTabBarPage) {
    if (number == 0) {
      // 删除红点点
      // wx.removeTabBarBadge({
      //   index: 3
      // })
      getCurrentPages()[0]?.getTabBar()?.setCount(0)
    } else {
      getCurrentPages()[0]?.getTabBar()?.setCount(number)
    }
  }
  return number
}

module.exports = {
  showTabBarBadge: showTabBarBadge
}