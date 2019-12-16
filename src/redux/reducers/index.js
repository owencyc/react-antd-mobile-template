import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

//多个redeucer时，整合为一个rootReducer
import getActionsAndReducers from '../../models/redux';

const { reducers } = getActionsAndReducers();
console.log('combineReducers', reducers)
export default (history) => {
  let hs = connectRouter(history);
  console.log('history', hs)
  return combineReducers({
    router: hs,
    ...reducers
  })
}