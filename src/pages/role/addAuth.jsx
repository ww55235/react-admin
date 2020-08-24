import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import PropTypes from "prop-types";

import menuList from "../../config/menuConfig";
const { TreeNode } = Tree;
export default class AddAuth extends Component {
  //生命接受值所属类型
  static propTypes = {
    role: PropTypes.object,
  };
  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus || [],
    };
  }

  //组件接受到新的props时调用
  UNSAFE_componentWillReceiveProps(nextProps) {
    let menus = nextProps.role.menus;
    //更新数据
    this.setState({
      checkedKeys: menus,
    });
  }

  getAuthMenu = () => [...this.state.checkedKeys];
  //选择tree中某一个node时触发的回调
  onCheck = (checkedKeys) => {
    // console.log("onCheck", checkedKeys);
    this.setState({ checkedKeys });
  };

  initTree = (menuList) => {
    return menuList.reduce((prev, item) => {
      prev.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.initTree(item.children) : null}
        </TreeNode>
      );
      return prev;
    }, []);
  };

  UNSAFE_componentWillMount() {
    this.getTreeNode = this.initTree(menuList);
  }
  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label="角色名称">
          <Input value={role.name} disabled />
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
          >
            <TreeNode title="平台权限" key="all">
              {this.getTreeNode}
            </TreeNode>
          </Tree>
        </Form.Item>
      </Form>
    );
  }
}
