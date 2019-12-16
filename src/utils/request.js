const _url = 'http://221.226.187.245:8888/wechatapi/home/test';
/*
*  get请求
*  params:参数
* */
export const get = (params) => {
    return new Promise((resolve, reject) => {
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
        }).then((response) => handleResponse(response))
            .then(json => {
                //进行框架验证/处理
                resolve({ a: 'test', data: json });
            })
            .catch(err => {
                console.err(err);
                return Promise.reject();
            });
    });
};
/*
*  post请求
*  params:参数,这里的参数格式是：{param1: 'value1',param2: 'value2'}
* */
export const postJSON = (params) => {
    return new Promise((resolve, reject) => {
        let url = _url;
    //fetch请求
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    }).then((response) => handleResponse(response))
            .then(json => {
                //进行框架验证/处理
                resolve({ a: 'test', data: json });
            })
            .catch(err => {
                console.err(err);
                return Promise.reject();
            });
    });
};
//通用处理方法-针对请求成功与否
function handleResponse(response) {
    if (response.status === 200) {
        return response.json();
    } else {
        console.error(`Request failed. Url = ${response.url} . Message = ${response.statusText}`);
        let error = new Error();
        error.name = response.status;
        error.message = response.statusText;
        error.response = response;
        throw error;
    }
}