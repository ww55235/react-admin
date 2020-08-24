//封装axios请求

//引入axios库文件

import axios from "axios";

import { message } from "antd";

//导出函数
export default function (url, data = {}, type = "get") {
  return new Promise((resolve, reject) => {
    let promise;
    if (type === "get") {
      promise = axios.get(url, {
        params: data,
      });

      promise
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          message.error("请求出错了" + error.message);
        });
    } else {
      promise = axios.post(url, data);
      promise
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          message.error("请求出错了" + error.message);
        });
    }
  });
}
