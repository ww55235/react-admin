import React, { Component } from "react";

//导图antd组件
import { Form, Icon, Input, Button } from "antd";

// import { reqLogin } from "../../api/index";

//import memoryUtils from "../../utils/memoryUtils";

//import storageUtils from "../../utils/storageUtils";

import { login } from "../../redux/createActions";

import { connect } from "react-redux";

import { Redirect } from "react-router-dom";
//导入logo图片
import logo from "./image/logo.png";

//引入样式
import "./login.less";

//登录组件
class Login extends Component {
  //密码框自定义验证
  handleValidator = (rule, value, callback) => {
    //console.log(value.length);
    //根据值进行判断
    if (value.length < 4) {
      callback("用户名不能小于4位");
    } else if (value.length > 12) {
      callback("用户名不能大于12位");
    } else if (!/^[a-zA-Z0-9_]+$/) {
      callback("用户名由数字、字母、下划线组成");
    } else {
      callback();
    }
  };

  //form表单提交
  handleSubmit = (e) => {
    e.preventDefault(); //阻止form表单的默认提交行为
    this.props.form.validateFields(async (err, values) => {
      const { username, password } = values;
      //如果验证通过
      if (!err) {
        this.props.login(username, password);

        // //console.log("校验成功", values);
        // const result = await reqLogin(username, password);
        // //console.log(response.data);
        // //成功的状态
        // if (result.status === 0) {
        //   message.success("登陆成功");
        //   //console.log(result);
        //   const user = result.data;
        //   //console.log(user);
        //   //保存在内存中
        //   memoryUtils.user = user;
        //   //存储到本地(local)中
        //   storageUtils.saveUser(user);
        //   //跳转到管理界面,登陆后不需要进行回退，所以使用replace
        //   this.props.history.replace("/home");
        // } else {
        //   //失败
        //   message.error(result.msg);
        // }
      } else {
        console.log("校验失败");
      }
    });

    // const { getFieldsValue } = this.props.form;
    //const values = getFieldsValue();
    // console.log(this.props);
    //console.log(values);
  };
  render() {
    //console.log(memoryUtils);
    //const { user } = memoryUtils; //{}
    const user = this.props.user;
    //console.log(user);
    //判断有没有值
    if (user && user._id) {
      return <Redirect to="/home" />;
    }

    const errorMsg = this.props.user.errorMsg;

    //得到传过来的form对象
    const form = this.props.form;
    const { getFieldDecorator } = form;
    return (
      <div className="login">
        <header className="login-header">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="title">React项目:后台管理系统</h1>
        </header>
        <section className="login-content" style={{ position: "relative" }}>
          <h2
            style={{
              backgroundColor: "red",
              textAlign: "center",
              position: "absolute",
              left: "40%",
              top: 0,
            }}
          >
            {errorMsg}
          </h2>
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {/* 声明式验证 */}
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入",
                  },
                  { min: 4, message: "用户名最少为4位" },
                  { max: 12, message: "用户名最多为12位" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须由数字、字母、下划线组成",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {/* 自定义验证 */}
              {getFieldDecorator("password", {
                rules: [{ validator: this.handleValidator }],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
const Wripper = Form.create()(Login);

export default connect((state) => ({ user: state.user }), { login })(Wripper);
