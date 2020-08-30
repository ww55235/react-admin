import React, { Component, Fragment } from "react";

import { Link, withRouter } from "react-router-dom";

import img from "../../assets/images/logo.png";

import "./index.less";

import menuList from "../../config/menuConfig";

import { Menu, Icon } from "antd";

//import memoryUtils from "../../utils/memoryUtils";

import { connect } from "react-redux";

import { set_header_title } from "../../redux/createActions";

const { SubMenu } = Menu;

class LeftNav extends Component {
  //判断是否有权限的函数
  hasAuth = (item) => {
    //console.log(item);
    const { key, isPublic } = item;
    // const username = memoryUtils.user.username;
    //  console.log(username);
    // const menus = memoryUtils.user.role.menus;

    const username = this.props.user.username;

    const menus = this.props.user.role.menus;
    //如果用户名为 admin 或者 用户权限中包含了 isPublic字段 或者权限中包含了key
    if (username === "admin" || isPublic || menus.includes(key)) {
      return true;
    } else if (item.children) {
      //如果item中存在children字段
      return !!item.children.find((cItem) => menus.includes(cItem.key));
    }
    return false;
  };

  //动态生成menu函数
  getMenuList = (menuList) => {
    const { pathname } = this.props.history.location;
    //遍历数组 mentList [{},{}]
    return menuList.map((item) => {
      //判断是否有权限
      if (this.hasAuth(item)) {
        if (!item.children) {
          if (item.key === pathname || pathname.startsWith(item.key)) {
            this.props.set_header_title(item.title);
          }
          return (
            <Menu.Item key={item.key}>
              <Link
                to={item.key}
                onClick={() => this.props.set_header_title(item.title)}
              >
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          const childrenItem = item.children.find((childrenItem) =>
            pathname.startsWith(childrenItem.key)
          );
          if (childrenItem) {
            this.openKey = item.key;
          }
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuList(item.children)}
            </SubMenu>
          );
        }
      }
    });
  };

  //在render之前执行(同步任务)
  UNSAFE_componentWillMount() {
    this.menuList = this.getMenuList(menuList);
  }

  render() {
    //console.log(this.props);
    let { pathname } = this.props.history.location;
    if (pathname.startsWith("/product")) {
      //判断路由路径是否以/product开头
      pathname = "/product";
    }
    //  console.log("render()", pathname);
    const openKey = this.openKey;
    return (
      <Fragment>
        <Link to="/" className="left-nav">
          <img src={img} alt="" />
          <h1>硅谷后台</h1>
        </Link>
        <div style={{ width: "100%" }}>
          <Menu
            selectedKeys={[pathname]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
          >
            {/* 动态生成结构 */}
            {this.menuList}
          </Menu>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  { set_header_title }
)(withRouter(LeftNav));
