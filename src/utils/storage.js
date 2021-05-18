const storage = {
  add:(obj)=>{
    localStorage.setItem(obj.name,JSON.stringify(obj))
  },
  remove:(obj)=>{
    localStorage.removeItem(obj.name)
  },
  get:(name)=>JSON.parse(localStorage.getItem(name))
}
export default storage
