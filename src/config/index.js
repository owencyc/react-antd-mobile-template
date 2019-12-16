
/**
 * 复合函数工具
 * @param funcs
 * @returns {*}
 */
export function compose(funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => {
        //console.log(...args);
        return a(b(...args));
    });
}
