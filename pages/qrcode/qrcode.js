// import AwesomeQR from 'awesome-qr'
// pages/qrcode/qrcode.js
// const AwesomeQR = require('awesome-qr')
// const { AwesomeQR } = require("awesome-qr");
// import drawQrcode from 'weapp-qrcode-canvas-2d'
const drawQrcode = require("weapp-qrcode-canvas-2d");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrTxt: 'https://github.com/liuxdi/wx-qr',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  logout(){
    wx.removeStorageSync('token')
    wx.removeStorageSync('uid')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onShow: function () {
    const query = wx.createSelectorQuery()
    console.log(query)
    query.select('#myQrcode')
        .fields({
            node: true,
            size: true
        })
        .exec((res) => {
            var canvas = res[0].node
            console.log(res)
            // 调用方法drawQrcode生成二维码
            drawQrcode({
                canvas: canvas,
                canvasId: 'myQrcode',
                width: 260,
                padding: 30,
                background: '#ffffff',
                foreground: '#000000',
                text: 'nelson6666',
            })
        })
  },

//   createQRCode: function () {
//   const query = wx.createSelectorQuery()
//   query.select('#myQrcode')
//       .fields({
//           node: true,
//           size: true
//       })
//       .exec((res) => {
//           var canvas = res[0].node
  
//           // 调用方法drawQrcode生成二维码
//           drawQrcode({
//               canvas: canvas,
//               canvasId: 'myQrcode',
//               width: 260,
//               padding: 30,
//               background: '#ffffff',
//               foreground: '#000000',
//               text: 'nelson6666',
//           })
  
          // 获取临时路径（得到之后，想干嘛就干嘛了）
          // wx.canvasToTempFilePath({
          //     canvasId: 'myQrcode',
          //     canvas: canvas,
          //     x: 0,
          //     y: 0,
          //     width: 260,
          //     height: 260,
          //     destWidth: 260,
          //     destHeight: 260,
          //     success(res) {
          //         console.log('二维码临时路径：', res.tempFilePath)
          //     },
          //     fail(res) {
          //         console.error(res)
          //     }
          // })
//       })
//   },

  // createQR: function () {
  //   // let AwesomeQR = require('awesome-qr');
  //   new AwesomeQR().create({
  //     text: 'Makito loves Kafuu Chino.',
  //     size: 500,
  //     callback: (data) => {
  //         // 二进制 PNG 数据
  //         console.log(data)
  //     }
  //   });
  // },

//   createQR2: function () {
//     const buffer = await new AwesomeQR({
//       text: "AwesomeQR by Makito - Awesome, right now.",
//       size: 500,
//       backgroundImage: background,
//     }).draw();
// }
})