export const creatModify = data=>{
  return {type:'modify',data}
}
export const mapStateToProps = (state)=>{
  return {
    user:state
  }
}
export const mapDispatchToProps = (dispatch)=>{
  return {
    setUser:user=>dispatch(creatModify(user))
  }
} 