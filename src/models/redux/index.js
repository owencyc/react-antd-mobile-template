import {createAction, handleActions} from 'redux-actions';
import * as _models from '../all-models';

/**
 * 获取并整合 actions reducers
 * @param models
 * @returns {{actions, reducers: {pageState}}}
 */
export default function getActionsAndReducers (models = _models) {
    const syncKeys = Object.keys(models).filter(key => {
        const {syncStorage} = models[key];
        return !!syncStorage;
    });

    const utils = actionUtils({syncKeys});
    let _actions = checkAction({utils});
    let _reducers = {};

    //遍历每个model，定义action和reducer
    //可能有多种写法，合并，独立编写
    Object.keys(models).forEach(modelName => {
        const model = models[modelName];
        let {
            initialState = {},//reducer的初始化对象
            syncStorage,//同步本地存储数据
            actions = {},//独立action写法
            reducers = {},//独立reducer写法
        } = model;

        const __actionTypes = {};

        initialState.__actionTypes = __actionTypes;

        // 处理action reducer 合并写法
        // 除去'initialState', 'syncStorage', 'actions', 'reducers'等约定属性，其他都视为actions与reducers合并写法
        const ar = {};
        Object.keys(model).forEach(item => {
            if (['initialState', 'syncStorage', 'actions', 'reducers'].indexOf(item) === -1) {
                ar[item] = model[item];
            }
        });

        const arActions = {};
        const arReducers = {};
        //遍历该model中的 合并写法的
        Object.keys(ar).forEach((actionName, index) => {
            //定义action的type，确保唯一
            const type = `type-${actionName}-${modelName}-${index}`.toUpperCase(); // 保证唯一并增强type可读性，方便调试；
            __actionTypes[actionName] = type;

            const arValue = ar[actionName];

            if (typeof arValue === 'function') { // ar 函数写法
                //创建action
                arActions[actionName] = createAction(type);
                //redux-action的reducer标准写法是
                // const reducer = handleActions(
                //     {
                //         [increment]: (state, { payload: { amount } }) => {
                //             return { ...state, counter: state.counter + amount };
                //         }
                //     },
                //     defaultState //默认值
                // );
                arReducers[type] = (state, action) => {
                    const {payload} = action;
                    //所以在model里编写合并方法时第一个参数是呼叫时传递的参数，要么是单个变量，要么是对象！
                    //第二个参数是当前model生成的state变量
                    return arValue(payload, state, action);
                };
            } else { // ar 对象写法 暂不支持
                // let {payload = identity, meta, reducer = (state) => ({...state})} = arValue;

                // // 处理meta默认值
                // if (!meta) {
                //     if (payload && typeof payload.then === 'function') { // is promise
                //         meta = commonAsyncMeta; // 异步默认meta
                //     } else {
                //         meta = identity; // 非异步默认 meta
                //     }
                // }

                // let metaCreator = meta;
                // let payloadCreator = payload;

                // // 非函数时，处理
                // if (typeof payloadCreator !== 'function') payloadCreator = () => payload;
                // if (typeof metaCreator !== 'function') metaCreator = () => meta;

                // arActions[actionName] = createAction(type, payloadCreator, metaCreator);
                // arReducers[type] = reducer;
            }

        });

        reducers = {...reducers, ...arReducers};
        actions = {...actions, ...arActions};

        // 处理reducer 将action触发reducer执行完成后返回的对象和原来的state合并
        // 所以model里的写法，只需返回新的对象
        const __reducers = {};
        Object.keys(reducers).forEach(key => {
            const reducer = reducers[key];

            if (typeof reducer === 'object') {
                // 对象写法 视为异步reducer
                // _handleAsyncReducer内部对新、旧state自动进行了合并，异步reducer各个函数（padding、resolve等）只需要返回新数据即可
                __reducers[key] = handleAsyncReducer(reducer);
            } else {
                // 函数视为普通reducer, 进行新、旧state合并，model中的reducer只返回新数据即可
                __reducers[key] = (state, action) => {
                    const newState = reducer(state, action) || {}; // 允许reducer不返回数据

                    // 检测 newState是否为对象
                    const isObject = typeof newState === 'object' && !Array.isArray(newState);
                    if (!isObject) {
                        console.error(`model method must return an object! check '${modelName}' method`);
                    }
                    // 检测新数据是否存在未在初始化state中定义的数据
                    const newStateKeys = Object.keys(newState);

                    const initialStateKeys = Object.keys(initialState);

                    newStateKeys.forEach(newKey => {
                        if (!initialStateKeys.includes(newKey)) {
                            console.error(`model method return {${newKey}} is not in ${modelName}.initialState! please define '${newKey}' in ${modelName}.initialState!`);
                        }
                    });

                    return {
                        ...state,
                        ...newState,
                    };
                };
            }
        });

        // if (syncStorage) {
        //     // 为meta添加__model_sync_name 和 __model_sync_state 属性，同步中间件会用到
        //     Object.keys(actions).forEach(item => {
        //         const actionCreator = actions[item];
        //         actions[item] = (...args) => {
        //             const action = actionCreator(...args);
        //             action.meta = action.meta === void 0 ? {} : action.meta;
        //             if (typeof action.meta !== 'object') throw new Error(`when model has syncStorage property，meta must be an object! check ${modelName} ${item} action method`);

        //             action.meta.__model_sync_name = modelName;
        //             action.meta.__model_sync_state = syncStorage;

        //             return action;
        //         };
        //     });

        //     // 从 store中恢复数据的reducer 如果为定义，使用默认reducers
        //     if (!__reducers[actionTypes.GET_STATE_FROM_STORAGE]) {
        //         __reducers[actionTypes.GET_STATE_FROM_STORAGE] = (state, action) => {
        //             const {payload = {}} = action;
        //             // state 为当前模块的初始化数据，data为当前模块存储的数据
        //             const data = payload[modelName] || {};

        //             // 深层结构的数据，会导致默认值失效，要使用递归，精确赋值
        //             return setObjectByObject(state, data);
        //         };
        //     }
        // }
        _actions[modelName] = actions;
        //console.log(modelName,' reducer init ',initialState);
        _reducers[modelName] = handleActions(__reducers, initialState);
    });
    //console.log('sc actions',_actions);
    return {
        actions: _actions,
        reducers: _reducers,
    };
}


const actionUtils = ({syncKeys = []}) => {
    return {
        //暂不需要本地数据
        // 同步本地数据到state中，一般在项目启动时，会调用此action进行同步。各个模块的reducer要对应的函数处理同步逻辑
        // getStateFromStorage: createAction(types.GET_STATE_FROM_STORAGE, () => {
        //     const Storage = getStorage();
        //     return Storage.multiGet(syncKeys);
        // }, (onResolve, onReject, onComplete) => {
        //     return {
        //         onResolve,
        //         onReject,
        //         onComplete,
        //     };
        // }),
    };
};

//处理是否有和系统方法同名，咱无系统方法，直接返回
const checkAction = (acs) => {
    const actionsFunctions = {};
    for (let key of Object.keys(acs)) {
        const action = acs[key];
        for (let k of Object.keys(action)) {
            if (actionsFunctions[k]) {
                throw Error(`不允许定义同名的action方法：${key}.${k} 与 ${actionsFunctions[k]._module}.${k} 方法冲突！`);
            } else {
                actionsFunctions[k] = action[k];
                actionsFunctions[k]._module = key;
            }
        }
    }
    return actionsFunctions;
};


/**
 * promise异步reducer参数说明
 * 每个函数的参数都是 (state, action)，每个函数的state都是上游函数处理过的最新state
 * 调用顺序：pending -> resolve(reject)->complete
 *
 * @param always = (state) => ({...state}),     // 每个状态之前都会触发，pending、resolve、reject、complete之前都会触发
 * @param pending = (state) => ({...state}),    // 请求开始之前
 * @param resolve = (state) => ({...state}),    // 成功
 * @param reject = (state) => ({...state}),     // 失败
 * @param complete = (state) => ({...state}),   // 完成，无论成功失败，都会触发
 * @returns {function(*=, *=)}
 */
const handleAsyncReducer = ({
    always = (state) => ({ ...state }),
    pending = (state) => ({ ...state }),
    resolve = (state) => ({ ...state }),
    reject = (state) => ({ ...state }),
    complete = (state) => ({ ...state }),
}) => {
    return (state, action) => {
        const { meta = {}, error } = action;
        const { sequence = {} } = meta;

        function getReturnState(preState, method) {
            const newState = method(preState, action) || {};
            // if (!newState) {
            //     throw Error(`handleAsyncReducer's ${method} method must return an object to compose a new state`);
            // }
            return { ...preState, ...newState };
        }

        const alwaysState = getReturnState(state, always);

        if (sequence.type === 'start') {
            return getReturnState(alwaysState, pending);
        }

        if (sequence.type === 'next' && error) {
            const rejectState = getReturnState(alwaysState, reject);
            return getReturnState(rejectState, complete);
        }

        if (sequence.type === 'next' && !error) {
            const resolveState = getReturnState(alwaysState, resolve);
            return getReturnState(resolveState, complete);
        }
    };
}

