import React, { Component } from "react";

import PropTypes from "prop-types";

import { Form, Input } from "antd";
class UpdateCategory extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
  };

  //调用传递过来的setForm函数向父组件传递form对象
  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { categoryName } = this.props;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator("categoryName", {
            initialValue: categoryName,
            rules: [{ required: true, message: "请输入要添加的内容" }],
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedUpdateCategory = Form.create()(UpdateCategory);
export default WrappedUpdateCategory;
