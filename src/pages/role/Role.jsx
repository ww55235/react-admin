import React, { Component } from "react";

import { PAGE_SIZE } from "../../utils/constants";

import { Table, Button, Card, Modal, message } from "antd";

import AddRole from "./addRole";

import AddAuth from "./addAuth";

import { reqGetRoles, reqAddRole, reqUpdateRole } from "../../api/index";

import dateFormate from "../../filters/dateFormate";

// import memoryUtils from "../../utils/memoryUtils";

// import storageUtils from "../../utils/storageUtils";

import { connect } from "react-redux";

import { loginOut } from "../../redux/createActions";

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [], //所有角色的列表
      role: {}, //选中的列表
      showAdd: false, //控制添加角色modal显示与隐藏
      showAuth: false, //控制添加权限modal显示与隐藏
    };

    this.authMenu = React.createRef();
  }
  getRoles = async () => {
    const result = await reqGetRoles();
    //获取数据成功
    if (result.status === 0) {
      //  更新状态
      const { data } = result;
      //console.log(data);
      this.setState({
        roles: data,
      });
    }
  };

  //发送ajax请求，获取角色列表信息
  componentDidMount() {
    this.getRoles();
  }

  getColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: dateFormate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: dateFormate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  //添加角色名称
  addRole = () => {
    //进行表单验证
    //console.log(this.form);
    this.form.validateFields(async (error, values) => {
      if (!error) {
        const { roleName } = values;
        //清除缓存
        this.form.resetFields();
        //发送ajax请求
        const result = await reqAddRole(roleName);
        //  console.log(result);
        //添加成功
        if (result.status === 0) {
          message.success("添加角色成功");
          const role = result.data;
          const roles = [...this.state.roles];
          roles.push(role);
          // console.log(roles);
          //隐藏modal并更新roles
          this.setState({
            showAdd: false,
            roles,
          });
        } else {
          message.error("添加角色失败");
        }
      }
    });
  };

  //添加角色权限
  updateAuth = async () => {
    //调用子组件中的方法得到 authMenu []
    const getAuthMenu = this.authMenu.current.getAuthMenu();
    //console.log(getAuthMenu);
    const { role } = this.state;
    role.menus = getAuthMenu;
    role.auth_name = this.props.user.username;
    role.auth_time = Date.now(); //获取当前时间的时间戳
    //console.log(role);
    //发送ajax请求更新后端数据
    const result = await reqUpdateRole(role);
    //更新成功
    if (result.status === 0) {
      //console.log(memoryUtils.user.role_id);
      if (role._id === this.props.user.role_id) {
        //清除内存中的数据
        // memoryUtils.user = {};
        //清除本地缓存的数据
        // storageUtils.removeUser();
        //跳转到登录接秒
        //this.props.history.replace("/login");
        this.props.loginOut();
        message.success("当前用户权限更新成功，请重新登陆");
      } else {
        //从后端获取更新后的数据 如果更新的不是自身的权限
        this.getRoles();
        message.success("权限更新成功");
      }
    } else {
      message.error("权限更新失败");
    }
    //隐藏modal
    this.setState({ showAuth: false });
  };

  onRow = (role) => {
    return {
      // 点击行
      onClick: (event) => {
        //更新状态
        this.setState({
          role,
        });
      },
    };
  };

  UNSAFE_componentWillMount() {
    this.getColumns();
  }
  render() {
    const { roles, role, showAdd, showAuth } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ showAdd: true })}
          style={{ marginRight: 15 }}
        >
          创建角色
        </Button>

        <Button
          onClick={() =>
            this.setState({
              showAuth: true,
            })
          }
          type="primary"
          disabled={!role._id}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
          }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => this.setState({ role }),
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={showAdd}
          onOk={this.addRole}
          onCancel={() => this.setState({ showAdd: false })}
        >
          <AddRole
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={showAuth}
          onOk={this.updateAuth}
          onCancel={() => this.setState({ showAuth: false })}
        >
          <AddAuth ref={this.authMenu} role={role} />
        </Modal>
      </Card>
    );
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  { loginOut }
)(Role);
