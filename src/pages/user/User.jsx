import React, { Component } from "react";

import { Card, Table, Button, Modal, message } from "antd";

import LinkButton from "../../components/linkButton/LinkButton";

import {
  reqGetUsers,
  reqDeltetUser,
  reqAddOrUpdateUser,
} from "../../api/index";

import dateFormate from "../../filters/dateFormate";

import AddUser from "./adduser";

export default class User extends Component {
  state = {
    users: [], //所有的用户信息
    roles: [], //角色信息
    isShow: false,
  };

  //更新/添加用户信息
  addOrUpdateUser = async () => {
    //发送请求添加一个用户
    //后去form表单中的数据
    //console.log(this.form);
    const user = this.form.getFieldsValue();
    //清除表单缓存数据
    this.form.resetFields();
    //console.log(user);

    //修改
    //console.log(this.user);
    let result;
    if (this.user) {
      user._id = this.user._id;
      result = await reqAddOrUpdateUser(user);
    } else {
      result = await reqAddOrUpdateUser(user);
    }

    if (result.status === 0) {
      message.success(`${this.user ? "修改" : "添加"}用户成功`);
      this.setState({
        isShow: false,
      });
      //重新向后端获取数据
      this.getUsers();
    }
  };

  //删除用户信息
  deltetUser = (user) => {
    //console.log(user);
    Modal.confirm({
      title: `你确定要删除${user.username}吗？`,
      onOk: async () => {
        //发送ajax请求删除用户数据
        const result = await reqDeltetUser(user._id);
        //console.log(result);
        if (result.status === 0) {
          message.success(`删除用户${user.username}成功`);
          //重新获取后端数据
          this.getUsers();
        }
      },
    });
  };

  //更新用户信息
  showUpdate = (user) => {
    //保存用户信息
    this.user = user;
    console.log(this.user);
    this.setState({ isShow: true });
  };

  handleCancel = () => {
    //清除文本框缓存
    this.form.resetFields();
    this.setState({
      isShow: false,
    });
  };
  getColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: dateFormate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => {
          // console.log(role_id);
          // const result = this.state.roles.find((role) => role._id === role_id);
          // return result ? result.name : {};

          // 性能比上一种方法好
          return this.roleNames[role_id];
        },
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deltetUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  };
  UNSAFE_componentWillMount() {
    this.getColumns();
  }

  getRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    //console.log(rolesName);
    this.roleNames = roleNames;
  };
  getUsers = async () => {
    const result = await reqGetUsers();
    //请求数据成功
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.getRoleNames(roles);
      //更新状态
      this.setState({
        users,
        roles,
      });
    }
  };
  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, isShow, roles } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => {
            // 清除之前保存的user信息
            this.user = null;
            this.setState({ isShow: true });
          }}
        >
          创建用户
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{
            defaultPageSize: 2,
          }}
        />
        <Modal
          title={this.user ? "修改数据" : "添加数据"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.handleCancel}
        >
          <AddUser
            user={this.user ? this.user : {}}
            roles={roles}
            setForm={(form) => (this.form = form)}
          />
        </Modal>
      </Card>
    );
  }
}
