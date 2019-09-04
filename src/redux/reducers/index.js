import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import reducer1 from './reducer1'
//多个redeucer时，整合为一个rootReducer


export default (history) => combineReducers({
  router: connectRouter(history),
  reducer1
})