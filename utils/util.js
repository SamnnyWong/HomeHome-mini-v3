const TuUrl = 'https://service-q3ksz16x-1304578354.sh.apigw.tencentcs.com/release'
const baseUrl = TuUrl
// 获取cookie
function get(key, type) {
  if (Isnull(type)) {
    if (Isnull(key)) return;
    var value = wx.getStorageSync(key)
    if (Isnull(value)) return;
    return value
  }
  if (Isnull(key)) return info('缺少必要的参数 key', type);
  var value = wx.getStorageSync(key)
  if (Isnull(value)) return info('目前没有缓存 ' + key, type);
  return value
}
// 存储cookie
function store(key, value, time) {
  // console.log(time, "设置缓存时间")
  if (Isnull(key)) return info('缺少必要的参数 key');
  if (Isnull(value)) return info('缺少必要的参数 value');
  wx.setStorageSync(key, value)
  if (!Isnull(time)) {
    if (isDataType(time) == 'number') {
      time = 43200000 * time
      if (time > 0) time = Date.parse(new Date()) + time * 1000;
      wx.setStorageSync(this.prefix + key, time)
    }
  }
}
// showToast
function info(title, icon, success, time, mask) {
  if (typeof icon == 'function') {
    success = icon;
    icon = "none";
  }
  title = title == undefined ? "系统繁忙" : title;
  icon = icon == undefined ? "none" : icon;
  time = time == undefined ? 1500 : time;
  mask = mask == undefined ? true : mask;
  wx.showToast({
    title: title,
    icon: icon,
    mask: mask,
    duration: time,
    success: setTimeout(() => {
      success && success()
    }, time)
  });
}
// 是不是一个时间
function isDataType(value) {
  return typeof(value) == 'object' ? isArray(value) ? 'Array' : 'Object' : typeof(value)
}
// 是不是一个数组
function isArray(object) {
  return Array.isArray(object);
}
// 为不为空
function Isnull(value) {
  if (value == null && value == undefined) return true;
  if (isDataType(value) == 'number') return false;
  return getLength(value) == 0 ? true : false
}
// 获取字符串长度
function getLength(object) {
  return Object.keys(object).length
}
// 请求req
function request(url, method, data){
  let _url = baseUrl+url;
  return new Promise((resolve, reject) => {
    // wx.showLoading({
    //   title: '正在加载',
    // });
    wx.request({
      url: _url,
      data: data?data:{},
      method: method?method:'GET',
      header: {
        'content-type': 'application/json',
        'authorization': "bearer "+get('token')
      },
      success: (res) => {
        resolve(res);
        // wx.hideLoading();
      },
      fail(res) {
        console.log(_url);
        console.log(data);
        console.log(method);
        console.log(res);
        reject('接口有误，请检查')
        wx.hideLoading();
      }
    });

  });
}
/**
 * 页面跳转
 * @param {Object} url
 * @param {Object} type
 */
function jump(url, type) {
  if (Isnull(url)) {
    info("正在开发中，尽情期待！！")
    return
  }
  switch (type) {
    case -1:
      //关闭当前页面，返回上一页面或多级页面 delta:1 返回层数
      wx.navigateBack({
        delta: 1,
      });
      return;
    case 0:
      //保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面
      wx.navigateTo({
        url: url,
      })
      return;
    case 1:
      //关闭当前页面，跳转到应用内的某个页面
      wx.redirectTo({
        url: url,
      })
      return;
    case 2:
      //关闭所有页面，打开到应用内的某个页面
      wx.reLaunch({
        url: url
      });
      return;
    case 3:
      //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      wx.switchTab({
        url: url
      });
      return;
    case 4:
      //预加载页面
      wx.preloadPage({
        url: url
      });
    default:
      return false;
  }
}
/**
 *返回上一页，更新数据
 * @param {Object} data
 * 	$myapi.jumpdata({
    people: "",//村民
    peo_mess:{},
    int_index1:'',
    int_index2:'',
    text:"",
    imgList:[],
  })
 
 
 */
function jumpdata(data) {
  // console.log(data,"返回上一页，更新数据",data.length)
  let pages = getCurrentPages(); //获取所有页面栈实例列表
  let nowPage = pages[pages.length - 1]; //当前页页面实例
  let prevPage = pages[pages.length - 2]; //上一页页面实例
  for (var i in data) {
    prevPage.$vm[i] = data[i];
  }
  // this.jump("/", -1)
  wx.navigateBack({
    delta: 1
  });
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
module.exports = {
  formatTime: formatTime,
  req: request,
  jump: jump,
  jumpdata: jumpdata,
  get: get,
  store: store,
  info: info,
  getLength: getLength,
  baseUrl: TuUrl
}
