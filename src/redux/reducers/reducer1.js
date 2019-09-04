const initData = {
    hh:"哈哈哈"
}
const reducer1 = (state = initData, action) => {
    switch (action.type) {
        case 'TEST':
            return {
                ...state,
                hh:action.data
            };
        default:
            return state;

    }
}

export default reducer1