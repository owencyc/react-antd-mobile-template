import { combineReducers } from 'redux';
//多个redeucer时，整合为一个rootReducer
import * as _models from './all-models';
import getActionsAndReducers from './redux';

const {reducers} = getActionsAndReducers();
export default (navReducer) => combineReducers({
    nav:navReducer,
    reducers
});

