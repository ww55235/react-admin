import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
} from "./createTypes";

import { reqLogin } from "../api/index";
import storageUtils from "../utils/storageUtils";

//同步设置头部标题的action
export const set_header_title = (headertitle) => ({
  type: SET_HEADER_TITLE,
  data: headertitle,
});

//重置用户信息
export const loginOut = () => {
  storageUtils.removeUser();
  return {
    type: RESET_USER,
  };
};

export const receive_user = (user) => ({
  type: RECEIVE_USER,
  user,
});

//显示同步请求失败的action

export const showErrorMsg = (errorMsg) => ({
  type: SHOW_ERROR_MSG,
  errorMsg,
});

//登陆的异步action
export const login = (username, password) => {
  return async (dispatch) => {
    //发送ajax请求
    const result = await reqLogin(username, password);
    //请求成功
    if (result.status === 0) {
      const user = result.data;
      //保存到localstorage中
      storageUtils.saveUser(user);
      dispatch(receive_user(user));
    } else {
      //失败
      let error = result.msg;
      dispatch(showErrorMsg(error));
    }
  };
};
