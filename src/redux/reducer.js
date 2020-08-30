import { combineReducers } from "redux";

import storage from "../utils/storageUtils";

import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
} from "./createTypes";

let initTitle = "首页";
//管理头部标题
const headerTitle = (state = initTitle, action) => {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return action.data;
    default:
      return state;
  }
};

//管理登陆用户
let initUser = storage.getUser();
const user = (state = initUser, action) => {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user;
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg;
      return { ...state, errorMsg };
    case RESET_USER:
      return {};
    default:
      return state;
  }
};

//整合多个reducer
export default combineReducers({
  user,
  headerTitle,
});
