Component({
  properties: {
  },
  data: {
    selected: 0,
    jiaoNums: 0,
    tabList:[
      {
        "pagePath": "pages/index/index",
        "text": "首页",
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类"
      },
      {
        "pagePath": "pages/qrcode/qrcode",
        "text": "二维码"
      },
      {
        "pagePath": "pages/shop-cart/index",
        "text": "购物车"
      },
      {
        "pagePath": "pages/my/index",
        "text": "我的"
      }
    ]
  },
  methods: {
    setCount(num) {
      this.setData({
        jiaoNums: num
      })
    },
    switchTab(e){
      let key = Number(e.currentTarget.dataset.index);
      let tabList = this.data.tabList;
      let selected = this.data.selected;
      if(selected !== key){
        this.setData({
          selected: key
        });
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
    }
  }
})

