//定义请求对应的接口路径

import jsonp from "jsonp";

import ajax from "./ajax";

import { message } from "antd";

const BASE = "";

export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "post");

export const reqAddOrUpdateUser = (user) =>
  ajax(BASE + "/manage/user/" + (user._id ? "update" : "add"), user, "post");

export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    //定义url
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    //发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // console.log("jsonp()", err, data);

      if (!err && data.status === "success") {
        //取出需要的数据
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        // console.log(dayPictureUrl, weather);
        resolve({ dayPictureUrl, weather });
      } else {
        //失败
        message.error("获取数据失败");
      }
    });
  });
};

//查询分类数据
export const reqCategorys = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });

//添加分类数据
export const reqAddCategory = ({ parentId, categoryName }) =>
  ajax(BASE + "/manage/category/add", { parentId, categoryName }, "POST");

//修改分类数据
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");

//请求商品数据

export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });

//根据条件(商品名称/商品描述)查询商品数据  productName/productDesc
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BASE + "/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

//根据分类ID获取分类

export const reqCategory = (categoryId) =>
  ajax(BASE + "/manage/category/info", { categoryId });

//修改上架/下架操作
export const reqUpdateCategoryStatus = (productId, status) =>
  ajax(BASE + "/manage/product/updateStatus", { productId, status }, "post");

//删除图片
export const reqDeleteImg = (name) =>
  ajax(BASE + "/manage/img/delete", { name }, "post");

//添加/更新商品

export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BASE + "/manage/product/" + (product._id ? "update" : "add"),
    product,
    "post"
  );

//获取角色列表
export const reqGetRoles = () => ajax(BASE + "/manage/role/list");

//添加一个角色
export const reqAddRole = (roleName) =>
  ajax(BASE + "/manage/role/add", { roleName }, "post");

//更新角色权限
export const reqUpdateRole = (role) =>
  ajax(BASE + "/manage/role/update", role, "post");

//获取所有的用户信息

export const reqGetUsers = () => ajax(BASE + "/manage/user/list");

//删除用户数据
export const reqDeltetUser = (userId) =>
  ajax(BASE + "/manage/user/delete", { userId }, "post");
