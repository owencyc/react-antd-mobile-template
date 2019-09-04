import { fetch } from 'whatwg-fetch'


const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };

export function ajaxApi(url, option = {}) {

    let params = {},

        method = option.method || 'post',

        data = option.data ;
        


    switch (method) {

        case 'get':

            url = url + (data ? '?' + formDataCode(data) : '');

            break;

        case 'post':

            params.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                
            };
            params.method=method;

            params.body = JSON.stringify(data);


            break;

        default:
            

            break;
    }

    return fetch(url, params).then(callback).catch(errHandle);

}

//创建修改参数格式的方法，改成提交的Form Data格式

function formDataCode(data) {

    let str = '';

    for (let i in data) {

        if (data.hasOwnProperty(i)) {
            str = str + i + "=" + data[i] + '&';
        }

    }

    return str ? str.substring(0, str.length - 1) : '';

}

//创建fetch中then方法的回调

function callback(res) {
    if(res.status===200){
        return res.json();
    }
    const errortext = codeMessage[res.status] || res.statusText;
    const error = new Error(errortext);
  error.name = res.status;
  error.response = res;
  throw error;

}

//创建容错方法

function errHandle(e) {
    if(e.name==404){
        console.log(e)
    }

}