import { ajaxApi }  from '../utils/request'

const apiPath='http://221.226.187.245:8888/wechatapi/api/test';
//const apiPath='http://localhost:51281/api/adapter';

export const allComments = () =>ajaxApi(apiPath,{method:"get"})