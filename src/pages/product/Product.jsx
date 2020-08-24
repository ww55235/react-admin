import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductHome from "./productHome";
import AddUpdateProduct from "./add-update";
import Detail from "./detail";
import "./product.less";
export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/product" exact component={ProductHome} />
          <Route path="/product/addproduct" component={AddUpdateProduct} />
          <Route path="/product/detail" component={Detail} />
          <Redirect to="/product" />
        </Switch>
      </div>
    );
  }
}
