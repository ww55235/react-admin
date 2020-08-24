import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
class AddRole extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="角色名称">
          {getFieldDecorator("roleName", {
            initialValue: "",
            rules: [{ required: true, message: "角色名称必须输入" }],
          })(<Input placeholder="请输入角色名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedAddCategory = Form.create()(AddRole);
export default WrappedAddCategory;
