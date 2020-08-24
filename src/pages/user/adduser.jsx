import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";

const Item = Form.Item;
const Option = Select.Option;

class AddUser extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array,
    user: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const { roles, user } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {getFieldDecorator("username", {
            initialValue: user.username,
            rules: [{ required: true, message: "用户名称必须输入" }],
          })(<Input placeholder="请输入用户名称" />)}
        </Item>
        {user._id ? null : (
          <Item label="密码">
            {getFieldDecorator("password", {
              initialValue: user.password,
              rules: [{ required: true, message: "必须输入密码" }],
            })(<Input type="password" placeholder="请输入密码" />)}
          </Item>
        )}
        <Item label="电话号码">
          {getFieldDecorator("phone", {
            initialValue: user.phone,
            rules: [{ required: true, message: "必须输入电话号码" }],
          })(<Input placeholder="请输入电话号码" />)}
        </Item>
        <Item label="邮箱">
          {getFieldDecorator("email", {
            initialValue: user.email,
            rules: [{ required: true, message: "邮箱必须输入" }],
          })(<Input placeholder="请输入邮箱" />)}
        </Item>
        <Item label="角色">
          {getFieldDecorator("role_id", {
            initialValue: user.role_id,
            rules: [{ required: true, message: "请选择角色" }],
          })(
            <Select>
              {roles.map((role) => (
                <Option value={role._id} key={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}

const WrappedAddCategory = Form.create()(AddUser);
export default WrappedAddCategory;
