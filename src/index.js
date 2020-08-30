import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import storageUtils from "./utils/storageUtils";

import { Provider } from "react-redux";
import store from "./redux/store";
import memoryUtils from "./utils/memoryUtils";
//读取本地数据

const user = storageUtils.getUser();
//console.log(user);

//存储到内存中
memoryUtils.user = user;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
