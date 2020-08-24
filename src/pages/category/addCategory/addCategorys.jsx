import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";
class AddCategory extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const { categorys, parentId } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator("parentId", {
            initialValue: parentId,
          })(
            <Select>
              <Select.Option value="0">一级分类</Select.Option>
              {categorys.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("categoryName", {
            initialValue: "",
            rules: [{ required: true, message: "请输入要添加的内容" }],
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedAddCategory = Form.create()(AddCategory);
export default WrappedAddCategory;
