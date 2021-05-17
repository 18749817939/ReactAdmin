export const user={
  admin:{}
}
export const localStorage = {
  saveUser:user=>{
    localStorage.user = JSON.stringify(user)
  },
  getUser:()=>JSON.parse(localStorage.user||'{}'),
  removeUser:()=>{
    localStorage.removeItem('user')
  }
}
