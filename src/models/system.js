import {createAction} from 'redux-actions';
import { push } from 'connected-react-router';

export default {
    initialState: {
        test:'hello system',
        tmp:'temp value in system',
        login:{},
    },

    // 单独action定义，需要使用actionType与reducer进行关联
    actions: {
        //路由跳转
        go: push,
    },

    changeTest: (test) => ({test}),

};

