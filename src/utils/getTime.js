const dateFormat = (time) => {
  if (!time) return ''
  return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
    + " " +
    `${time.getHours()}:${time.getMinutes()>=10?time.getMinutes():'0'+time.getMinutes()}:${time.getSeconds()>=10?time.getSeconds():'0'+time.getSeconds()}`
}
export default dateFormat