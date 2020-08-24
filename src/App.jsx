import React, { Component } from "react";
//引入路由
import { BrowserRouter, Route, Switch } from "react-router-dom";
//引入组件
import Login from "./pages/ligon/Login";
import Admin from "./pages/admin/Admin";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/*匹配到后不再往后面匹配 */}
          <Route path="/login" component={Login} />
          <Route path="/" component={Admin} /> {/**admin */}
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
