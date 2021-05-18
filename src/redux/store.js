import {createStore} from 'redux'
import {userReducer} from './reducer'
export default createStore(userReducer)