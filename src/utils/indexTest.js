const myDate = new Date()
const dateFormat = (time) =>{
    if (!time) return ''
    return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`+" " +
    `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}
console.log(myDate)
console.log(myDate.getYear());    // 获取当前年份(2位)
console.log(myDate.getFullYear());  // 获取完整的年份(4位,1970-????)
myDate.getMonth();    // 获取当前月份(0-11,0代表1月)
myDate.getDate();    // 获取当前日(1-31)
myDate.getDay();     // 获取当前星期X(0-6,0代表星期天)
myDate.getTime();    // 获取当前时间(从1970.1.1开始的毫秒数)
console.log(myDate.getHours());    // 获取当前小时数(0-23)
console.log(myDate.getMinutes());   // 获取当前分钟数(0-59)
console.log(myDate.getSeconds());   // 获取当前秒数(0-59)
myDate.getMilliseconds();  // 获取当前毫秒数(0-999)
myDate.toLocaleDateString();   // 获取当前日期
var mytime = myDate.toLocaleTimeString();   // 获取当前时间
console.log(mytime)
console.log(myDate.toLocaleString());    // 获取日期与时间
// console.log(new Date().Format('yyyy-MM-dd hh:mm:ss'))
console.log(new Date(Date.now()))
console.log(dateFormat(new Date()))