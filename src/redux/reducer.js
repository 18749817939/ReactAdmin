export function userReducer(initialState={},action){
  const {type,data} = action
  switch(type){
    case 'modify':
      return data
    default:
      return initialState
  }
}