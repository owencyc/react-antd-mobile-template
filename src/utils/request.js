const _url = 'http://221.226.187.245:8888/wechatapi/home/test';
/*
*  get请求
*  params:参数
*  callback:回调函数
* */
export const get = (params, callback) => {
    let url = _url;
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    //fetch请求
    fetch(url, {
        method: 'GET',
    }).then((response) => response.json())
        .then((response) => {
            //先解析是否有框架报错
            callback(response);
        })
        .catch((error) => {
            //请求异常，全局抛出
        });
};
/*
*  post请求
*  params:参数,这里的参数格式是：{param1: 'value1',param2: 'value2'}
*  callback:回调函数
* */
export const postJSON = (params, callback) => {
    let url = _url;
    //fetch请求
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    }).then((response) => response.json())
        .then((responseJSON) => {
            //解析框架结构
            callback(responseJSON);
        }).catch((error) => {
            console.log('error = ' + error);
        });
};
