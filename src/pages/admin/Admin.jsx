import React, { Component, Fragment } from "react";

import { Redirect, Switch, Route } from "react-router-dom";

//import memoryUtils from "../../utils/memoryUtils";

import { connect } from "react-redux";

import { Layout } from "antd";
import Header from "../../components/header/Header";

import LeftNav from "../../components/left-nav/LeftNav";

import Home from "../home/Home";

import Category from "../category/Category";
import Product from "../product/Product";
import Role from "../role/Role";
import User from "../user/User";
import Bar from "../charts/Bar";
import Line from "../charts/Line";
import Pie from "../charts/Pie";
import NotFound from "../notFound/NotFound";

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
  render() {
    // console.log("render()");
    //console.log(memoryUtils);
    //const { user } = memoryUtils;

    const { user } = this.props;

    //读取数据

    if (!user || !user._id) {
      return <Redirect to="/login" />;
    }
    return (
      <Fragment>
        {/* <h1>你好</h1>
        <p>{user.username}</p> */}
        <Layout style={{ minHeight: "100%" }}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header></Header>
            <Content style={{ margin: 20, backgroundColor: "#fff" }}>
              <Switch>
                <Redirect exact from="/" to="/home" />
                <Route path="/home" component={Home} />
                <Route path="/category" component={Category} />
                <Route path="/role" component={Role} />
                <Route path="/user" component={User} />
                <Route path="/product" component={Product} />
                <Route path="/charts/bar" component={Bar} />
                <Route path="/charts/pie" component={Pie} />
                <Route path="/charts/line" component={Line} />
                <Route component={NotFound} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center", color: "#ccc" }}>
              推荐使用谷歌浏览器,可以获得更佳页面操作体验
            </Footer>
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}
export default connect(
  (state) => ({
    user: state.user,
  }),
  {}
)(Admin);
