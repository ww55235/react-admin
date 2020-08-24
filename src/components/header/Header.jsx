import React, { Component } from "react";
import "./index.less";
import dateFormate from "../../filters/dateFormate";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
import { reqWeather } from "../../api/index";
import { withRouter } from "react-router-dom";

import LinkButton from "../linkButton/LinkButton";

import { Modal } from "antd";

const { confirm } = Modal;

class Header extends Component {
  constructor(props) {
    super(props);
    //定义状态
    this.state = {
      currentTime: dateFormate(Date.now()),
      weather: "",
      dayPictureUrl: "",
    };
  }

  //获取当前时间，并更新
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = dateFormate(Date.now());
      this.setState({
        currentTime,
      });
    }, 1000);
  };
  //获取天气
  getWeather = async () => {
    const result = await reqWeather("宜章");
    const { dayPictureUrl, weather } = result;
    //更新状态
    this.setState({
      dayPictureUrl,
      weather,
    });
  };

  getTitle = () => {
    //取出当前路由对应的路径
    const { pathname } = this.props.location;
    //用来保存标题信息
    let title;
    //数组遍历
    menuList.forEach((item) => {
      if (item.key === pathname) {
        title = item.title;
      } else if (item.children) {
        let childrenItem = item.children.find((childrenItem) =>
          pathname.startsWith(childrenItem.key)
        );
        if (childrenItem) {
          // console.log(childrenItem);
          title = childrenItem.title;
        }
      }
    });
    return title;
  };

  //第一次render之后执行 ，一般在此执行异步任务(启动定时器，发ajax请求等)
  componentDidMount() {
    //获取时间
    this.getTime();
    //获取天气
    this.getWeather();
  }

  //清除定时器 组件即将销毁的时候
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  loginOut = (e) => {
    const _this = this;
    //阻止默认跳转事件
    e.preventDefault();
    confirm({
      title: "你确定要退出吗?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        //删除本地存储
        storageUtils.removeUser();
        //删除内存中用户信息
        memoryUtils.user = {};
        _this.props.history.replace("/login");
      },
    });
  };

  render() {
    //获取title
    const title = this.getTitle();
    const { currentTime, weather, dayPictureUrl } = this.state;
    const { username } = memoryUtils.user;
    return (
      <div className="Header">
        <div className="header-top">
          <span>欢迎,{username}</span>
          {/* <a href="h" onClick={} className="exit">
            退出
          </a> */}
          <LinkButton onClick={this.loginOut}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span className="time">{currentTime}</span>
            <img className="imgs" src={dayPictureUrl} alt="img" />
            <span className="desc">{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
