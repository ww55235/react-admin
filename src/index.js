import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import storageUtils from "./utils/storageUtils";

import memoryUtils from "./utils/memoryUtils";
//读取本地数据

const user = storageUtils.getUser();
//console.log(user);

//存储到内存中
memoryUtils.user = user;

ReactDOM.render(<App />, document.getElementById("root"));
