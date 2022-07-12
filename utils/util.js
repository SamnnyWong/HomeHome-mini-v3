const TuUrl = 'https://ojoo.cn'
const baseUrl = TuUrl+'/index.php'
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
    wx.showLoading({
      title: '正在加载',
    });
    wx.request({
      url: _url,
      data: data?data:{},
      method: method?method:'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('token') ? wx.getStorageSync('token'):''
      },
      success: (res) => {
        resolve(res.data);
        wx.hideLoading();
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
  get: get,
  store: store,
  info: info,
  getLength: getLength,
  baseUrl: TuUrl
}
