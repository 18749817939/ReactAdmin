const storage = {
  add:(obj)=>{
    localStorage.setItem(obj.name,JSON.stringify(obj))
  },
  remove:(name)=>{
    localStorage.removeItem(name)
  },
  get:(name)=>JSON.parse(localStorage.getItem(name))
}
export default storage
