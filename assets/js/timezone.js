function showTime() {
  // 创建一个新的Date对象
  var now = new Date();
  // 将当前时间转换为GMT+8时区的时间
  var time = now.toLocaleTimeString('en-US', {timeZone: 'Asia/Shanghai'});
  // 显示时间
  document.getElementById('time').textContent = time;
}

// 设置定时器每秒更新时间
setInterval(showTime, 1000);

// 初始化时间显示
showTime();
