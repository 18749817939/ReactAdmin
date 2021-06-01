const storage = {
  add:(obj,name='')=>{
    localStorage.setItem(name?name:obj.name,JSON.stringify(obj))
  },
  remove:(name)=>{
    localStorage.removeItem(name)
  },
  removeAll:()=>{localStorage.clear()},
  get:(name)=>JSON.parse(localStorage.getItem(name))
}
export default storage
