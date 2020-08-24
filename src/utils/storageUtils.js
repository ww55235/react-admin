//引入store处理兼容性问题
import store from "store";

//定义一个常量用来保存key值
const USER_KEY = "user_key";

export default {
  //保存用户信息值
  saveUser(user) {
    //localStorage.setItem(USER_KEY, JSON.stringify(user));
    store.set(USER_KEY, user);
  },
  //获取值
  getUser() {
    //const user = localStorage.getItem(USER_KEY);
    //return JSON.parse(user || "{}");
    return store.get(USER_KEY) || {};
  },
  //删除值
  removeUser() {
    //localStorage.removeItem(USER_KEY);
    store.remove(USER_KEY);
  },
};
